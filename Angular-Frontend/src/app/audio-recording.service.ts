import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as RecordRTC from 'recordrtc';
import * as moment from 'moment';

interface RecordedAudioOutput {

}

@Injectable({
  providedIn: 'root'
})
export class AudioRecordingService {
  private stream: any;
  private recorder: any;
  private interval: any;
  private startTime: any;
  private _recorded = new Subject<RecordedAudioOutput>();
  private _recordingTime = new Subject<string>();
  private _recordingFailed = new Subject<string>();
  private recordingSeconds = new Subject<any>();
  private blur = new Subject<any>();
  private _recordPopUp = new Subject<any>();

  constructor() { }

  recordPopUp(): Observable<string> {
    return this._recordPopUp.asObservable();
  }
  blurView(): Observable<string> {
    return this.blur.asObservable();
  }

  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this._recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }
  recordingTimeSecond(): Observable<string> {
    return this.recordingSeconds.asObservable();
  }

  blurBG(blur:any) {
    this.blur.next(blur)
  }

  openRecordPopup() {
    this._recordPopUp.next("block");
    this.blur.next("blur(8px)");
  }

  startRecording() {

    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }

    this._recordingTime.next('00:00');
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(s => {
        this.stream = s;
        this.record();
      }).catch(error => {
        alert("Please check microphone permission")
        this._recordingFailed.next("failed");
      });

  }

  abortRecording() {
    this.stopMedia();
  }

  private record() {

    this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
      type: 'audio',
      mimeType: 'audio/mp3'
    });

    this.recorder.record();
    this.startTime = moment();
    this.interval = setInterval(
      () => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
        this._recordingTime.next(time);
        this.recordingSeconds.next(diffTime.seconds());
      },
      500
    );
  }

  private toString(value: any) {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  stopRecording() {
    if (this.recorder) {
      this.recorder.stop((blob: any) => {
        if (this.startTime) {
          const mp3Name = encodeURIComponent('audio_' + new Date().getTime() + '.mp3');
          this.stopMedia();
          this._recorded.next({ blob: blob, title: mp3Name });
          this.recordingSeconds.next(0);
        }
      }, () => {
        this.stopMedia();
        this._recordingFailed.next("failed");
      });
    }
  }

  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach((track:{stop: () => any;})  => track.stop());
        this.stream = null;
      }
    }
  }

  convertBase64TobBob(b64:any) {
    const byteCharacters = atob(b64.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {type: 'audio/mp3'});
  //this.audioBlob = blob;
  return blob;
  
  }

  convertBlobToBase64 = (blob:any) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

}
