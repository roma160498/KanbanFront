import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {
	constructor(private http: HttpClient) { }

	getUser(args): Observable<User[]> {
		console.log(124455)
		return this.http.get(environment.baseServerURL + '/user', {
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
		return this.http.get(environment.baseServerURL + '/user', {
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
		return this.http.delete(environment.baseServerURL + '/user/' + args.id, { withCredentials: true }).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}

	insertUser(user: User, userName) {
		const body = { user: user, userName };
		return this.http.post(environment.baseServerURL + '/user/', body, { withCredentials: true }).
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

	updateUser(user: User, id, diff, userName) {
		const body = { user: user, diff, userName };
		console.log(user)
		return this.http.put(environment.baseServerURL + '/user/' + id, body, { withCredentials: true }).
			map((response: Response) => {
				if (response.status == 201) {
					return response;
				} else {
					return null;
				}
			}).catch(e => {
				return Observable.throw(e);
			});
	}

	getUserPermission(args, id) {
		return this.http.get(`${environment.baseServerURL}/user/${id}/permissions`, {
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

	updateUserPermission(permissions, userId) {
		const body = { permissions: JSON.stringify(permissions) };
		return this.http.put(`${environment.baseServerURL}/user/${userId}/permissions`, body, { withCredentials: true }).
			map((response: Response) => {
				if (response.status == 201) {
					return response;
				} else {
					return null;
				}
			}).catch(e => {
				return Observable.throw(e);
			});
	}

	getKanbanForUser(args, userId) {
		return this.http.get(`${environment.baseServerURL}/user/${userId}/kanbans`, {
			withCredentials: true, params: {}
		}).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
}
