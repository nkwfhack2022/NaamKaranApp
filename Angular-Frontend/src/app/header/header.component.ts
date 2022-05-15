import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginSignupService } from '../login-signup.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  uid:any = '';
  status:any = "Sign Up";
  constructor( private loginService: LoginSignupService, private route:Router) { 
    if(route.url.includes('login')) {
      this.status = "Sign Up";
    } else if(route.url.includes('register')) {
      this.status = "Login";
    } else if(route.url.includes('search-name')) {
      this.status = "Log Out"
    }
    this.loginService.updateUid().subscribe((uid) => {
      console.log(uid)
      this.uid = uid;
    });
  }

  ngOnInit(): void {
  }
  logIn(status:any) {
    if(status == "Sign Up") {
      this.route.navigate(['/register']);
      this.status = "Login";
    } else if(status == "Login") {
      this.route.navigate(['/login']);
      this.status = "Sign Up";
    }
  }
  logOut() {
    this.route.navigate(['/login'])
    this.status = "Sign Up";
    this.uid = '';
  }

}
