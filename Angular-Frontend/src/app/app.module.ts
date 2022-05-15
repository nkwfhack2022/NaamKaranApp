import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ViewComponent } from './view/view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AudioRecordingService } from './audio-recording.service';
import { LogInOutComponent } from './log-in-out/log-in-out.component';
import { RegistrationComponent } from './registration/registration.component';
import { RecordPopupComponent } from './record-popup/record-popup.component';
import { LoginSignupService } from './login-signup.service';
import { RecordApiService } from './record-api.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ViewComponent,
    LogInOutComponent,
    RegistrationComponent,
    RecordPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [AudioRecordingService, LoginSignupService, RecordApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
