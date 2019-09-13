import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { environment } from '../../environments/environment';

import { User } from '../models/user';
@Injectable()
export class AuthenticateService{

	constructor(private http: HttpClient, private router: Router) { }


	checkSession() : Observable<any> {
		return this.http.get(environment.baseServerURL + '/sessions', {withCredentials: true}).
			map((response: Response) =>{
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}

	logout() {
		this.http.get(environment.baseServerURL + '/logout', {withCredentials: true}).
		map((response: Response) =>{
			return response
		}).catch(e => {
			return Observable.throw(e);
		}).subscribe(
			res => {
				this.router.navigate(['/login']);
			},
			err => {
				this.router.navigate(['/login']);
			}
		);
	}

	login(username, password) : Observable<any>{
		const body = {
			'username': username,
			'password': password
		  }
		return this.http.post(environment.baseServerURL + '/login', body, {withCredentials: true}).
		map((response: Response) =>{
			return response
		}).catch(e => {
			console.log('err')
			return Observable.throw(e);
		});
	}
}
