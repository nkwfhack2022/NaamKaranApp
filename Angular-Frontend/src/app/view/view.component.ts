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
  stdAudioUrl:any ;
  stdDisplay:any="none";
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

  get_similar_names(){
    this.suggestedNames = []
    this.recordApi.getSimilarNames({"GivenName": this.typedName}).subscribe((res)=>{
      for(let i =0;i<res.result.length;i++)
      {
        this.suggestedNames.push({id: i, name:res.result[i][1], phonetic:""})
      }
    })
  }

  fetchStandardPronounciation() {
    const traitId = "'" + window.localStorage.getItem("traitId") + "'";
    this.recordApi.getTrait({"TraitId": traitId, "option": "select"}).subscribe((res)=>{
      console.log(res)
      this.ttsPayload.VoiceName = res.result[0][4];
    })
    this.ttsPayload.PrefName = this.typedName;
    console.log(this.ttsPayload)
    this.recordApi.getTTS(this.ttsPayload).subscribe((res)=>{
      
      this.stdAudioUrl = res.blob_address;
      this.stdDisplay = "block";
      
    })

   /*call tts
      global templist
      selcted one inserted into db and others will be deleted
   */
  }
  closeSTDPopUp(){
    this.stdDisplay ="none";
  }

  saveAudio() {
    /*
    payload = {"AudioType": "'A'", 
#            "AudioB64": "''", 
#            "BlobAddress":"'https://wfhck2022nkstorage1.blob.core.windows.net/audiofiles/Atchyutha.mp3'"
#           }
    */

    const payload = {
      AudioType: "'A'",
      AudioB64: "''",
      BlobAddress: "'" + this.stdAudioUrl + "'"
    }
    this.recordApi.insertAudio(payload).subscribe((res:any) =>{
      this.recordApi.assignRecordId(res.Id);
      
    })
    this.closeSTDPopUp();
  }

}


