import {
  Component,
  ChangeDetectorRef,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';
import { StereoAudioRecorder } from 'recordrtc';
import { SongService } from '../../services/songs.service';
import { fingerPrinting } from '../../store/actions/songs.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import { environment } from 'src/environments/environment';
import { AzureBlobStorageService } from 'src/app/audio-recognizer/services/azureStorage.service';
const RECORD_TIME: number = 10000;
const VISUALIZED_WIDTH: number = 450;
const VISUALIZED_HEIGHT: number = 240;

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss'],
})
export class RecorderComponent implements OnInit, AfterViewInit {
  @ViewChild('ngVisualizationContainer') ngVisualizationContainer: ElementRef;

  // Visualization
  containerWidth: number;
  containerHeight: number;
  loadVisualization: boolean;
  wavesurfer: WaveSurfer = null;

  // Flag
  imported: boolean = false;
  showControls: boolean = false;
  loading: boolean = false;
  recording = false;
  toggle: string = 'play_arrow';
  paused = false;
  preview = false;

  // TIME CONST
  remainTime: number = RECORD_TIME;
  startTime: number = 0;
  startPosition: string;
  endTime: number;
  endPosition: string;
  counter: string = '';
  fileBlob: Blob;

  //Record & File
  record: StereoAudioRecorder;
  url: string;
  newUrl: string;
  options = {
    mimeType: 'audio/wav',
    numberOfAudioChannels: 1,
    sampleRate: 48000,
    blockAlign: 4,
    bitsPerSample: 16,
  };

  //Azure
  recordsContainer = environment.azureStorage.recordsContainer;
  recordsSAS = environment.azureStorage.recordsSAS;
  storageURL = '';

  constructor(
    private azureStorageService: AzureBlobStorageService,
    private songsService: SongService,
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadVisualization = false;
  }

  calculateTimeDuration(milsecs: number) {
    var n = NaN;
    if (milsecs >= 60000) {
      n = Math.floor(milsecs / 60000);
      milsecs = milsecs % 60000;
    }
    let min = isNaN(n)
      ? Math.floor(milsecs / 60000)
      : Math.floor(milsecs / 60000) + n;
    let sec = Math.floor(milsecs / 1000);
    let milsec = isNaN(n)
      ? Math.floor((milsecs - min * 60000 - sec * 1000) / 100)
      : Math.floor((milsecs + n * 60000 - min * 60000 - sec * 1000) / 100);
    let minText: string = isNaN(min) ? '00' : min.toString();
    let secText: string = isNaN(sec) ? '00' : sec.toString();
    let milText: string = isNaN(milsec) ? '00' : milsec.toString();

    if (min < 10) {
      minText = '0' + min;
    }

    if (sec < 10) {
      secText = '0' + sec;
    }

    if (milsec) {
      milText = '0' + milsec;
    }
    return minText + ':' + secText + ':' + milText;
  }

  timerTick() {
    if (this.recording && !this.paused) {
      if (this.remainTime > 0) {
        this.remainTime -= 100;
        this.counter = this.calculateTimeDuration(this.remainTime);
      } else {
        this.remainTime = 0;
        this.counter = this.calculateTimeDuration(this.remainTime);
        this.stopRecording();
        return;
      }
      setTimeout(() => this.timerTick(), 100);
    }
  }

  generateWaveForm(): void {
    if (this.preview) {
      Promise.resolve(null).then(() => {
        this.wavesurfer = WaveSurfer.create({
          container: '#preview_wave',
          height: 168,
          waveColor: '#000',
          progressColor: '#003D89',
          cursorColor: 'white',
          cursorWidth: 4,
          cursorRadius: 2,
          fillParent: true,
          barHeight: 0.8,
          barWidth: 4,
          barRadius: 2,
          barGap: 6,
          plugins: [
            RegionsPlugin.create({
              regionsMinLength: 2,
              regions: [
                {
                  id: 0,
                  start: this.startTime,
                  end: this.endTime / 1000,
                  resize: false,
                  loop: false,
                  color: 'rgba(255,255,255,0.2)',
                },
              ],
            }),
          ],
        });
      });
    }
  }

  importData(event: any): void {
    if (!this.preview) {
      // Switch back to ready record card
      this.imported = true;
      this.preview = true;
      this.recording = false;
      this.paused = false;
      if (event.target.files && event.target.files[0]) {
        this.processRecording(event.target.files[0]);
      }
    }
  }

  onPressReview(): void {
    this.generateWaveForm();

    //Detect when add wave to DOM
    this.cdr.detectChanges();

    Promise.resolve().then(() => this.wavesurfer.load(this.url));
  }

  reset(): void {
    this.recording = false;
    this.remainTime = RECORD_TIME;
    this.startTime = 0;
    this.paused = false;
    this.preview = false;
    this.record.clearRecordedData();
    this.url = '';
  }

  // Cut audio when import audio file
  cut() {
    // startTime and endTime
    var start = this.wavesurfer.regions.list[0].start;
    var end = this.wavesurfer.regions.list[0].end;

    var originalAudioBuffer = this.wavesurfer.backend.buffer;

    var lengthInSamples = Math.floor(
      (end - start) * originalAudioBuffer.sampleRate
    );

    var offlineAudioContext = this.wavesurfer.backend.ac;

    var emptySegment = offlineAudioContext.createBuffer(
      originalAudioBuffer.numberOfChannels,
      lengthInSamples,
      originalAudioBuffer.sampleRate
    );

    var newAudioBuffer = offlineAudioContext.createBuffer(
      originalAudioBuffer.numberOfChannels,
      start === 0
        ? originalAudioBuffer.length - emptySegment.length
        : originalAudioBuffer.length,
      originalAudioBuffer.sampleRate
    );

    for (
      var channel = 0;
      channel < originalAudioBuffer.numberOfChannels;
      channel++
    ) {
      var new_channel_data = newAudioBuffer.getChannelData(channel);
      var empty_segment_data = emptySegment.getChannelData(channel);
      var original_channel_data = originalAudioBuffer.getChannelData(channel);

      var before_data = original_channel_data.subarray(
        0,
        start * originalAudioBuffer.sampleRate
      );
      var mid_data = original_channel_data.subarray(
        start * originalAudioBuffer.sampleRate,
        end * originalAudioBuffer.sampleRate
      );
      var after_data = original_channel_data.subarray(
        Math.floor(end * originalAudioBuffer.sampleRate),
        originalAudioBuffer.length * originalAudioBuffer.sampleRate
      );

      empty_segment_data.set(mid_data);
      if (start > 0) {
        new_channel_data.set(before_data);
        new_channel_data.set(after_data, start * newAudioBuffer.sampleRate);
      } else {
        new_channel_data.set(after_data);
      }
    }

    return emptySegment;
  }

  bufferToWave(abuffer) {
    var numOfChan = abuffer.numberOfChannels,
      length = abuffer.length * numOfChan * 2 + 44,
      buffer = new ArrayBuffer(length),
      view = new DataView(buffer),
      channels: any[] = [],
      i,
      sample,
      pos = 0,
      offset = 0;

    // write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit (hardcoded in this demo)

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    // write interleaved data
    for (i = 0; i < abuffer.numberOfChannels; i++)
      channels.push(abuffer.getChannelData(i));

    while (pos < length) {
      for (i = 0; i < numOfChan; i++) {
        // interleave channels
        sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
        view.setInt16(pos, sample, true); // update data chunk
        pos += 2;
      }
      offset++; // next source sample
    }

    // create Blob
    return new Blob([buffer], { type: 'audio/wav' });

    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  }

  download() {
    if (this.imported) {
      var audioBuffer = this.cut();
      var blob = this.bufferToWave(audioBuffer);
      this.newUrl = URL.createObjectURL(blob);
    }
    this.saveAsAFile();
  }

  saveAsAFile(): void {
    const dlink: HTMLAnchorElement = document.createElement('a');
    dlink.download = this.imported ? 'cut_audio.wav' : 'record_audio.wav';
    dlink.href = this.imported ? this.newUrl : this.url;
    dlink.click(); // this will trigger the dialog window
    dlink.remove();
  }

  ngAfterViewInit(): void {
    if (this.recording) {
      this.getContainerDimensions();
      setTimeout(() => {
        this.initVisualization();
      }, 100);
    }
    // this.initVisualization();
  }

  getContainerDimensions() {
    // Get Width and Height for Visualization
    this.containerWidth =
      this.ngVisualizationContainer.nativeElement.clientWidth;
    this.containerHeight =
      this.ngVisualizationContainer.nativeElement.clientHeight;
  }

  initVisualization() {
    this.loadVisualization = true;
  }

  processAudio() {
    if (this.imported) {
      var audioBuffer = this.cut();
      this.fileBlob = this.bufferToWave(audioBuffer);
    }
    this.loading = true;
    this.DispatchToServer();
  }

  togglePlay(): void {
    if (!this.wavesurfer.isPlaying()) {
      this.wavesurfer.regions.list[0].play();
      this.toggle = 'pause';

      var timeOut = 10000;
      if (!this.imported) {
        timeOut = RECORD_TIME - this.remainTime;
      }

      // switch btn when end
      setTimeout(() => {
        if (this.toggle == 'pause' && !this.wavesurfer.isPlaying())
          this.toggle = 'play_arrow';
      }, timeOut);
    } else {
      this.toggle = 'play_arrow';
      this.wavesurfer.pause();
    }
    // console.log(this.wavesurfer.regions.list[0]);
    // console.log(this.wavesurfer);
  }

  replay(): void {
    if (this.wavesurfer.regions.list[0].start >= 10) {
      this.wavesurfer.regions.list[0].start -= 10;
      this.wavesurfer.regions.list[0].end -= 10;

      this.startTime = +this.startTime - 10000;
      this.endTime = +this.endTime - 10000;

      this.startPosition = this.calculateTimeDuration(this.startTime);
      this.endPosition = this.calculateTimeDuration(this.endTime);

      this.wavesurfer.regions.list[0].updateRender();
    }
  }
  forward(): void {
    if (
      this.wavesurfer.regions.list[0].end <=
      this.wavesurfer.getDuration() - 10
    ) {
      this.wavesurfer.regions.list[0].start += 10;
      this.wavesurfer.regions.list[0].end += 10;

      this.startTime = +this.startTime + 10000;
      this.endTime = +this.endTime + 10000;

      this.startPosition = this.calculateTimeDuration(this.startTime);
      this.endPosition = this.calculateTimeDuration(this.endTime);

      this.wavesurfer.regions.list[0].updateRender();
    }
  }
  initiateRecording() {
    this.recording = true;
    let mediaConstraints = {
      video: false,
      audio: true,
    };

    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));

    this.timerTick();

    this.containerWidth = VISUALIZED_WIDTH;
    this.containerHeight = VISUALIZED_HEIGHT;
    this.initVisualization();
  }

  previewRecord(): void {
    if (!this.preview) {
      this.preview = true;
      this.record.stop(this.processRecording.bind(this));
    }
  }

  successCallback(stream) {
    this.record = new StereoAudioRecorder(stream, this.options);
    this.record.record();
    //setTimeout(() => this.previewRecord(), 10000);
  }

  resumeRecording() {
    if (this.recording && this.paused) {
      this.record.resume();
      this.paused = false;
      this.timerTick();
    }
  }

  stopRecording(): void {
    if (this.recording) {
      this.recording = false;
      this.preview = true;
      this.record.stop(this.processRecording.bind(this));
    }
  }

  pauseRecording(): void {
    if (!this.paused) {
      this.paused = true;
      this.record.pause();
    }
  }

  async processRecording(blob) {
    this.url = URL.createObjectURL(blob);
    this.fileBlob = blob;

    if (!this.imported) {
      this.endTime = RECORD_TIME - this.remainTime;
      this.startPosition = this.calculateTimeDuration(this.startTime);
      this.endPosition = this.calculateTimeDuration(this.endTime);
    } else {
      this.endTime = 10000;
      this.startPosition = this.calculateTimeDuration(this.startTime);
      this.endPosition = this.calculateTimeDuration(this.endTime);
    }

    this.onPressReview();
  }
  DispatchToServer() {
    this.save();
    // const formData = new FormData();
    // formData.append('audio', this.fileBlob);
  }

  save() {
    const name = this.newUid();
    const fileName = name + '.wav';
    console.log('Upload to azure: ' + fileName);
    this.azureStorageService.upload(
      this.recordsContainer,
      this.recordsSAS,
      this.fileBlob,
      fileName,
      () => {
        this.store.dispatch(fingerPrinting({ fileName: fileName }));
      }
    );
  }

  newUid() {
    return Date.now().toString(36) + Math.random().toString(36);
  }

  errorCallback(error) {
    throw error('Can not play audio in your browser');
  }
}
