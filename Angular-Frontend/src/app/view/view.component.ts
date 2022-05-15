import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { AudioRecordingService } from '../audio-recording.service';
import { RecordApiService } from '../record-api.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  typedName: string = "";
  suggestedNames: any[] = [
   {id:1, name:"Deepak", phonetic:"dee-pak"},
   {id:2, name:"Dipak", phonetic:"di-pak"},
   {id:3, name:"Deepok", phonetic:"dee-pok"},
   {id:4, name:"Deepaak", phonetic:"dee-paak"},
   {id:5, name:"Diipak", phonetic:"dii-pak"},
   {id:5, name:"Diipak", phonetic:"dii-pak"},
   {id:5, name:"Diipak", phonetic:"dii-pak"},
   {id:5, name:"Diipak", phonetic:"dii-pak"},
   {id:5, name:"Diipak", phonetic:"dii-pak"},
  ];
  recordId:any;
  isPlaying:any=false;
  constructor(
    private audioRecordingService: AudioRecordingService,
    private recordApi: RecordApiService,
    private ref: ChangeDetectorRef,
  ) { 
    this.recordApi._getRecordId().subscribe((id) => {
      this.recordId = id;
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
  }

}


