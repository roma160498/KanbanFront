import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Team } from '../models/team';

@Injectable()
export class TeamService {

  constructor(private http: HttpClient) { }
  getTeam(args): Observable<Team[]> {
		return this.http.get('http://localhost:3000/team', {
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
	getTeamCount(args): Observable<any> {
		return this.http.get('http://localhost:3000/team', {
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
	deleteTeam(args) {
		return this.http.delete('http://localhost:3000/team/' + args.id, { withCredentials: true }).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
	insertTeam(team: Team) {
		const body = { team: team };
		return this.http.post('http://localhost:3000/team/', body, { withCredentials: true }).
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
