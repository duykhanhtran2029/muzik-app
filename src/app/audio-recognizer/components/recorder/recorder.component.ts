import { Component, OnInit } from '@angular/core';
import { AudioContext } from 'angular-audio-context';
import * as RecordRTC from "recordrtc";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss']
})
export class RecorderComponent implements OnInit {

  //Lets initiate Record OBJ
    public record;
    //Will use this flag for detect recording
    public recording = false;
    //Url of Blob
    public url;
    public error;

  constructor(private domSanitizer: DomSanitizer) { }

  sanitize(url:string){
        return this.domSanitizer.bypassSecurityTrustUrl(url);
    }

  ngOnInit(): void {

  }


  initiateRecording() {
        
        this.recording = true;
        let mediaConstraints = {
            video: false,
            audio: true
        };
        navigator.mediaDevices
            .getUserMedia(mediaConstraints)
            .then(this.successCallback.bind(this), this.errorCallback.bind(this));
    }

     successCallback(stream) {
        var options = {
            mimeType: "audio/wav",
            numberOfAudioChannels: 2,
            sampleRate:48000,
            blockAlign:4,
            bitsPerSample:16
        };
        //Start Actuall Recording
        var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
        this.record = new StereoAudioRecorder(stream, options);
        this.record.record();
    }

    stopRecording() {
        this.recording = false;
        this.record.stop(this.processRecording.bind(this));
    }
 
    processRecording(blob) {
        this.url = URL.createObjectURL(blob);
        RecordRTC.invokeSaveAsDialog(blob);
    }
  
    errorCallback(error) {
        this.error = 'Can not play audio in your browser';
    }

}
