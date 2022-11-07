import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Intent } from 'src/app/shared/model/intent';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogflowService {

  constructor( private http:HttpClient ) { }

  API:string = "https://dialogflow.googleapis.com/v2/projects/sylvan-mode-367816/agent/sessions/-:detectIntent";
  TOKEN:string = "ya29.a0AeTM1ifVeF1QOnz4Z5_QasxG93Dtv-aZxOIPOjY8gzSn6wDB47WQ_6zF2l6nwXFB_6-iWTShHueauxJ2Vr0kD46P_a5x6D3g1HQraRuBKwP2QAP1w7ee2olx4KM_l4L8rO0yFTnD9HUY-eCrhuXvu3wP3MvysgaCgYKAUkSARASFQHWtWOmXmnx5ZQePN41pWdrQEVDvg0165";

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.TOKEN}`
  })

  sendIntent(intent:Intent):Observable<any>{
    return this.http.post<Intent>(this.API, intent, {headers: this.headers});
  }
}
