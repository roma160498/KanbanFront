import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';

@Injectable()
export class ImageLoaderService {

  constructor(private http: HttpClient) { }

  uploadUserAvatar(file, userId): Observable<any> {
    const formData: FormData= new FormData();
    formData.append('file', file, file.name);
    const req = new HttpRequest('POST', environment.baseServerURL + '/files/', formData);

    const progress = new Subject<number>();

    return this.http.post(environment.baseServerURL + '/files/userAvatar/' + userId, formData, {
      responseType: 'blob'
    }).map((response: any) => {
      return response;
    });
  }

  getImageByName(name): Observable<any> {
    return this.http.get(environment.baseServerURL + `/files/uploadedImages/name/` + name, {
      responseType: 'blob'
    }).map((response: any) => {
      return response;
    })
  }

  getImageById(id): Observable<any> {
    return this.http.get(environment.baseServerURL + `/files/uploadedImages/id/` + id, {
      responseType: 'blob'
    }).map((response: any) => {
      return response;
    })
  }
  
}
