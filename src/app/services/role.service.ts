import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Role } from '../models/role';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class RoleService {

  constructor(private http: HttpClient) { }

  getRole(args): Observable<Role[]> {
		return this.http.get(environment.baseServerURL + '/roles', {
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
	getRoleByName(name): Observable<Role[]> {
		console.log('name is ' + name)
		return this.http.get(environment.baseServerURL + '/roles', {
			withCredentials: true, params: {
				'name': name
			}
		}).
			map((response: Response) => {
				console.log('resp is');
				console.log(response)
				return response
			}).catch(e => {
				console.log('err');
				return Observable.throw(e);
			});
	}
}
