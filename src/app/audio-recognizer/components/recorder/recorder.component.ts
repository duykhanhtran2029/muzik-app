import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { StereoAudioRecorder } from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import { SongService } from '../../services/songs.service';
import { fingerPrinting } from '../../store/actions/songs.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { FingerPrintingResult } from 'src/app/interfaces/fingerPrintingResult.interface';
import { getFingerPrintingResult } from '../../store/selectors/songs.selector';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss'],
})
export class RecorderComponent implements OnInit, AfterViewInit {
  @ViewChild('ngVisualizationContainer') ngVisualizationContainer: ElementRef;

  containerWidth: number;
  containerHeight: number;

  loadVisualization: boolean;

  selectedVisualization: number = 1;

  showControls: boolean = false;
  timeout: any;

  record: StereoAudioRecorder;
  recording = false;
  url: string;
  options = {
    mimeType: 'audio/wav',
    numberOfAudioChannels: 1,
    sampleRate: 48000,
    blockAlign: 4,
    bitsPerSample: 16,
  };

  constructor(
    private domSanitizer: DomSanitizer,
    private songsService: SongService,
    private store: Store<AppState>
  ) {}

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  ngOnInit(): void {
    this.loadVisualization = false;
  }

  ngAfterViewInit(): void {
    this.getContainerDimensions();
    setTimeout(() => {
      this.initVisualization();
    }, 100);
    // this.initVisualization();
  }

  getContainerDimensions() {
    this.containerWidth =
      this.ngVisualizationContainer.nativeElement.clientWidth;
    this.containerHeight =
      this.ngVisualizationContainer.nativeElement.clientHeight;
  }

  initVisualization() {
    this.loadVisualization = true;
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
  }

  successCallback(stream) {
    this.record = new StereoAudioRecorder(stream, this.options);
    this.record.record();
    setTimeout(() => this.stopRecording(), 10000);
  }

  stopRecording(): void {
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
  }

  async processRecording(blob) {
    this.url = URL.createObjectURL(blob);
    const formData = new FormData();
    formData.append('audio', blob);
    this.store.dispatch(fingerPrinting({ formData }));
  }

  errorCallback(error) {
    throw error('Can not play audio in your browser');
  }
}
