import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';

@Injectable()
export class ImageLoaderService {

  constructor(private http: HttpClient) { }

  uploadImage(file): Observable<any> {
    const formData: FormData= new FormData();
    formData.append('file', file, file.name);
    const req = new HttpRequest('POST', environment.baseServerURL + '/files/', formData);

    const progress = new Subject<number>();

    return this.http.post(environment.baseServerURL + '/files/', formData).map((response: any) => {
      debugger;
    });
    // return this.http.request(req).map((response: any[]) => {
    //   return response
    // }).catch(e => {
    //   return Observable.throw(e);
    // });
    // const myHeaders = new HttpHeaders().set('Content-Type', 'multipart/form-data; boundary=--123456');
    // myHeaders.set('Accept', 'application/json');
    // return this.http.post(environment.baseServerURL + '/images/', file, { headers:myHeaders,
    // withCredentials: true }).
		// 	map((response: Response) => {
		// 		if (response.status == 201) {
		// 			return response;
		// 		} else {
		// 			return null;
		// 		}
		// 	}).catch(e => {
		// 		return Observable.throw(e);
		// 	});
  }
}
