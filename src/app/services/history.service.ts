import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';

@Injectable()
export class HistoryService {

  constructor(private http: HttpClient) { }

  getHistory(type, id): Observable<any> {
    return this.http.get(environment.baseServerURL + `/history`, {
        params: {
            type,
            id
        }
      }).map((response: any) => {
        return response;
      })
  }  
}
