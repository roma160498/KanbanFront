import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry } from 'rxjs/operators';

@Injectable()
export class UserService {
	constructor(private http: HttpClient) { }

	getUser(args): Observable<User[]> {
		return this.http.get('http://localhost:3000/user', {
			withCredentials: true, params: {
				'amount': args.amount,
				'offset': args.offset,
				'properties': args.properties
			}
		}).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
	getUserCount(args): Observable<any> {
		return this.http.get('http://localhost:3000/user', {
			withCredentials: true, params: {
				'amount': args.amount,
				'offset': args.offset,
				'properties': args.properties,
				'isCount': 'true'
			}
		}).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}

	deleteUser(args) {
		return this.http.delete('http://localhost:3000/user/' + args.id, { withCredentials: true }).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}

	insertUser(user: User) {
		const body = { user: user };
		return this.http.post('http://localhost:3000/user/', body, { withCredentials: true }).
			map((response: Response) => {
				if (response.status == 200) {
					return response;
				} else {
					return null;
				}
			}).catch(e => {
				return Observable.throw(e);
			});
	}
}
