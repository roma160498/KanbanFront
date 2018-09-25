import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Team } from '../models/team';
import { RoleService } from './role.service';

@Injectable()
export class TeamService {

	constructor(private http: HttpClient, private roleService: RoleService) { }
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
	getUsersOfTeam(args, teamId): Observable<Team[]> {
		return this.http.get('http://localhost:3000/teams/' + teamId + '/users', {
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
	getUsersOfTeamCount(args, teamId): Observable<Team[]> {
		return this.http.get('http://localhost:3000/teams/' + teamId + '/users', {
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
	deleteUsersOfTeam(teamId, userId) {
		return this.http.delete(`http://localhost:3000/teams/${teamId}/users/${userId}`, { withCredentials: true }).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
	updateUsersOfTeam(teamId, userId, item) {
			const body = { item: item };
			return this.http.put('http://localhost:3000/teams/' + teamId + '/users/' + userId, body, { withCredentials: true }).
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
	insertUsersOfTeam(teamId, users) {
		const body = { users: users };
		console.log(body);
		return this.http.post(`http://localhost:3000/teams/${teamId}/users`, body, { withCredentials: true }).
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
	updateTeam(team: Team, id) {
		const body = { team: team };
		console.log(team);
		return this.http.put('http://localhost:3000/team/' + id, body, { withCredentials: true }).
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
}
