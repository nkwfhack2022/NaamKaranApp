import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioRecordingService } from '../audio-recording.service';
import { RecordApiService } from '../record-api.service';

@Component({
  selector: 'app-record-popup',
  templateUrl: './record-popup.component.html',
  styleUrls: ['./record-popup.component.css']
})
export class RecordPopupComponent implements OnInit {
  audioBlobUrl: any;
  audioBlob:any;
  audioName:any;
  audioStream:any;
  audioConf:any = {audio:true};
  isAudioRecording: Boolean = false;
  popUPDisplay :string = "none";
  startRecording: string = "block";
  stopRecording: string = "none";
  playRecording: string = "none";
  audioRecordedTime: any;
  audioTimeSecond:any;
  playAudio: Boolean = false;
  recordPayLoad:any = {
    AudioB64: ""
  }
  constructor(
    private ref: ChangeDetectorRef,
    private audioRecordingService: AudioRecordingService,
    private sanitizer: DomSanitizer,
    private recordApi: RecordApiService
  ) { 
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isAudioRecording = false;
      this.ref.detectChanges();
 });
 this.audioRecordingService.recordPopUp().subscribe((popUpDisplay) => {
  this.popUPDisplay = popUpDisplay;
  this.ref.detectChanges();
});

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.audioRecordedTime = time;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data:any) => {
      this.audioBlob = data.blob;
      this.audioName = data.title;
      this.audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      this.ref.detectChanges();
    });
    this.audioRecordingService.recordingTimeSecond().subscribe((time) => {
      if(parseInt(time) == 11) {
        this.stopAudioRecording();
        this.playAudio = true;
        this.ref.detectChanges();
        return;
      }
      this.audioTimeSecond = time;
      this.ref.detectChanges();
    });
  }

  ngOnInit(): void {
  }

  startAudioRecording() {
    if (!this.isAudioRecording) {
      this.isAudioRecording = true;
      this.startRecord();
      this.audioRecordingService.startRecording();
    }
  }

  abortAudioRecording() {
    if (this.isAudioRecording) {
      this.isAudioRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopAudioRecording() {
    if (this.isAudioRecording) {
      this.audioRecordingService.stopRecording();
      this.isAudioRecording = false;
      this.playAudio = true;
    }
  }

  clearAudioRecordedData() {
    this.audioBlobUrl = null;
    this.playAudio = false;
    this.isAudioRecording = false;
  }
  ngOnDestroy(): void {
    this.abortAudioRecording();
  }

  // openPopUp() {
  //   this.popUPDisplay = "block";
  //   this.audioRecordingService.blurBG("blur(8px)");
  // }
  closePopUp() {
    this,this.popUPDisplay = "none";
    this.audioRecordingService.blurBG("blur(0px)");
  }
  startRecord() {
    this.stopRecording = "block";
    this.startRecording = "none";
    this.playRecording = "none";
  }
  stopRecord() {
    this.stopRecording = "none";
    this.startRecording = "block";
    this.playRecording = "none";
  }
  private audioObj = new Audio();
  async playRecord() {
    const blob = new Blob([this.audioBlob], { type: 'audio/mp3' });

    this.audioObj.src = window.URL.createObjectURL(blob);
    this.audioObj.load();
    //this.audioObj.playbackRate=0.5;
    this.audioObj.play();
  }
  

  async saveRecord() {
    const blob = new Blob([this.audioBlob], { type: 'audio/mp3' });
    const base64String = await this.audioRecordingService.convertBlobToBase64(blob);
    this.recordPayLoad.AudioB64 = "'" + base64String +  "'";
    this.recordApi.insertRecord(this.recordPayLoad).subscribe((res:any) =>{
      this.recordApi.assignRecordId(res.Id);
      
    })
    this.closePopUp();
  }


}
