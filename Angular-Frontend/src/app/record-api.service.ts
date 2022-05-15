import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordApiService {
  private recordId = new Subject<any>();
  private recordUrl:string = "https://naamkaran-db-gateway.azurewebsites.net/insert_audio";
  private getRecordUrl:string = "https://naamkaran-db-gateway.azurewebsites.net/get_audio";
  constructor(private http: HttpClient) { }
  insertRecord(data:any):Observable<any> {
    return this.http.post<any>(this.recordUrl, data).pipe((res)=>res);
  }
  getRecord(data:any):Observable<any> {
    return this.http.post<any>(this.getRecordUrl, data).pipe((res)=>res);
  }
  _getRecordId(): Observable<string> {
    return this.recordId.asObservable();
  }
  assignRecordId(id:any) {
    this.recordId.next(id);
  }
}
