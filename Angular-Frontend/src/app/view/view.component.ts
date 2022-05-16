import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { AudioRecordingService } from '../audio-recording.service';
import { LogInOutComponent } from '../log-in-out/log-in-out.component';
import { LoginSignupService } from '../login-signup.service';
import { RecordApiService } from '../record-api.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  typedName: string = "";
  suggestedNames: any[] = []
  tempNames:any = [];
  //  {id:1, name:"Deepak", phonetic:"dee-pak"},
  //  {id:2, name:"Dipak", phonetic:"di-pak"},
  //  {id:3, name:"Deepok", phonetic:"dee-pok"},
  //  {id:4, name:"Deepaak", phonetic:"dee-paak"},
  //  {id:5, name:"Diipak", phonetic:"dii-pak"},
  //  {id:5, name:"Diipak", phonetic:"dii-pak"},
  //  {id:5, name:"Diipak", phonetic:"dii-pak"},
  //  {id:5, name:"Diipak", phonetic:"dii-pak"},
  //  {id:5, name:"Diipak", phonetic:"dii-pak"},
  // ];
  ttsPayload:any = {
    PrefName: "", 
    VoiceName: "",
  }
  ttID:any ={};
  recordId:any=1003;
  isPlaying:any=false;
  stdAudioUrl:any="https://wfhck2022nkstorage1.blob.core.windows.net/audiofiles/Atchyutha.mp3";
  stdDisplay:any=false;
  constructor(
    private audioRecordingService: AudioRecordingService,
    private recordApi: RecordApiService,
    private loginService: LoginSignupService,
    private ref: ChangeDetectorRef,
  ) { 
    this.recordApi._getRecordId().subscribe((id) => {
      this.recordId = id;
      this.ref.detectChanges();
 });
 this.loginService.getTraitID().subscribe((id) => {
  console.log(id)
  this.ttID.id = id;
  console.log(this.ttID)
  this.ref.detectChanges();
});
  }

  ngOnInit(): void {
  }

  openPopUp() {
    this.audioRecordingService.openRecordPopup();
  }
  
  private audioObj = new Audio();
  async playRecord() {
    this.isPlaying = true;
    this.recordApi.getRecord({"AudioId": this.recordId, "option": "select"}).subscribe((res:any)=>{
      console.log(res.result[0][1].split("'")[1])
      const audioBlob = this.audioRecordingService.convertBase64TobBob(res.result[0][1].split("'")[1]);
      const blob = new Blob([audioBlob], { type: 'audio/mp3' });

      this.audioObj.src = window.URL.createObjectURL(blob);
      this.audioObj.load();
      this.audioObj.play();
      console.log(this.audioObj.duration ,this.audioObj.currentTime)
      if(this.audioObj.duration == this.audioObj.currentTime) {
        this.isPlaying = false;
      }
    })
    // const url = "https://wfhck2022nkstorage1.blob.core.windows.net/audiofiles/Atchyutha.mp3"
    // this.audioObj.src =url;
    // this.audioObj.load();
    // this.audioObj.play();
  }

  fetchStandardPronounciation() {
    console.log(this.typedName)
    this.stdDisplay = true;
    const traitId = "'" + window.localStorage.getItem("traitId") + "'";
    this.recordApi.getTrait({"TraitId": traitId, "option": "select"}).subscribe((res)=>{
      console.log(res)
    })
    // this.recordApi.getTTS({"AudioId": this.recordId, "option": "select"}).subscribe((res:any)=>{
    //   console.log(res.result[0][1].split("'")[1])
    //   const audioBlob = this.audioRecordingService.convertBase64TobBob(res.result[0][1].split("'")[1]);
    //   const blob = new Blob([audioBlob], { type: 'audio/mp3' });

    //   this.audioObj.src = window.URL.createObjectURL(blob);
    //   this.audioObj.load();
    //   this.audioObj.play();
    //   console.log(this.audioObj.duration ,this.audioObj.currentTime)
    //   if(this.audioObj.duration == this.audioObj.currentTime) {
    //     this.isPlaying = false;
    //   }
    // })

   /*call tts
      global templist
      selcted one inserted into db and others will be deleted
   */
  }
  closeSTDPopUp(){
    this.stdDisplay = false;
  }

}


