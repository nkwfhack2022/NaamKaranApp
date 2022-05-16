import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginSignupService } from '../login-signup.service';
import { Traits } from '../traits';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  user:any = {
    FirstName:"",
    MiddleName:"",
    LastName:"",
    UserId:"",
    Language:"",
    Gender:"",
    Nationality:"",
    Pswd:"",
    NameId: 0, 
    TraitId:"",
    UseChoice:"Y",
    Pace:"S"
  }
  confirmPassword:any;

  languages:any = [];
  nationality:any = [];
  traits:any =[];

  constructor(private signUPServive: LoginSignupService, private route:Router) {
    this.signUPServive.getTraits().subscribe((res:any)=>{
      let natSet = new Set();
      let lanSet = new Set();
      this.traits = res.result;
      for(let i=0; i<res.result.length;i++) {
        lanSet.add(res.result[i][1])
        let str = res.result[i][1];
        let val = str.substring(str.indexOf(' ') + 1);
          if(val.includes("(")) {
            val = val.substring(1, val.length-1);
            natSet.add(val)
          }
      }
      for(let nat of natSet) {
        this.nationality.push(nat)
      }
      for(let lan of lanSet) {
        this.languages.push(lan)
        
      }
    })
   }

  ngOnInit(): void {
  }

  submit() {
    if(this.user.Pswd != this.confirmPassword) {
      alert("Password and Confirm password should be same");
      return;
    }
    this.assignTraitId();
   
    this.user.Language = this.user.Language.split(" ")[0];
    console.log(this.user)
    this.addQuote();
    this.signUPServive.saveTraitId(this.user.TraitId);
    window.localStorage.setItem("traitId", this.user.TraitId);
    this.signUPServive.register(this.user).subscribe((res) =>{
      console.log(res)
      this.route.navigate(['/login'])
    });
  }

  addQuote() {
    this.user.FirstName = "'" +this.user.FirstName+"'";
    this.user.MiddleName = "'" +this.user.MiddleName+"'";
    this.user.LastName = "'" +this.user.LastName+"'";
    this.user.UserId = "'" +this.user.UserId+"'";
    this.user.Language = "'" +this.user.Language+"'";
    this.user.Gender = "'" +this.user.Gender+"'";
    this.user.Nationality = "'" +this.user.Nationality+"'";
    this.user.Pswd = "'" +this.user.Pswd+"'";
    this.user.UseChoice = "'" +this.user.UseChoice+"'";
    this.user.Pace = "'" +this.user.Pace+"'";
  }

  assignTraitId() {
    for(let i=0;i<this.traits.length;i++) {
      if(this.traits[i][1] == this.user.Language && this.traits[i][3] == this.user.Gender) {
        this.user.TraitId = this.traits[i][0];
        return;
      }
    }
  }

}
