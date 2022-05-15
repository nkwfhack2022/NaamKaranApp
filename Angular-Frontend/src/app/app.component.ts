import { Component } from '@angular/core';
import { AudioRecordingService } from './audio-recording.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'team-namkaran';
  blur:any = "blur(0px)";
  
  constructor(private viewCom: AudioRecordingService) {
    this.viewCom.blurView().subscribe((blur) => {
      this.blur = blur;
    });
    
  }
}
