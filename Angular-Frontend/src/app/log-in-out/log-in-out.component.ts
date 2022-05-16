import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginSignupService } from '../login-signup.service';

@Component({
  selector: 'app-log-in-out',
  templateUrl: './log-in-out.component.html',
  styleUrls: ['./log-in-out.component.css']
})
export class LogInOutComponent implements OnInit {

  user:any ={
    UserId:"",
    option: "select"
  }
  password:any;
  tID:any;
 
  constructor(private logInService: LoginSignupService, private route:Router) { 
    this.user.UserId = "";
  }
  isRegistration: boolean = true;
  ngOnInit(): void {
  }

  logIn() {
    this.user.UserId = "'"+this.user.UserId+"'";
    this.logInService.login(this.user ).subscribe((res) =>{
      console.log(res)
      window.localStorage.setItem("traitId", res.result[0][9]);
      if(res.result[0][4] != this.password) {
        alert("Please enter correct password");
        return;
      }
      this.route.navigate(['/search-name'])
      this.logInService.updateUID(this.user.UserId);
    })
  }


}
