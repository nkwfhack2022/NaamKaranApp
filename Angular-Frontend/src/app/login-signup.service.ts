import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginSignupService {
  private registerUrl:string = "https://naamkaran-db-gateway.azurewebsites.net/insert_user";
  private loginUrl:string = "https://naamkaran-db-gateway.azurewebsites.net/get_user";
  private traitUrl:string = "https://naamkaran-db-gateway.azurewebsites.net/get_audio_traits"
  private _uid = new Subject<any>();
  private traitId = new Subject<any>();
  constructor(private http: HttpClient) { }

  updateUid(): Observable<string> {
    return this._uid.asObservable();
  }
  getTraitID(): Observable<string> {
    return this.traitId.asObservable();
  }

  updateUID(uid:any) {
    this._uid.next(uid);
  }

  saveTraitId(id:any) {
    console.log(id)
    this.traitId.next(id);
  }

  register(data:any):Observable<string> {
    return this.http.post<any>(this.registerUrl, data);
  }
  login(data:any):Observable<any> {
    return this.http.post<any>(this.loginUrl, data).pipe((res)=>res);
  }
  getTraits():Observable<any> {
    return this.http.post<any>(this.traitUrl, {"option": "all"}).pipe((res)=>res);
  }
}
