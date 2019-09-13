import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Comment } from '../models/comment';
import { environment } from '../../environments/environment';

@Injectable()
export class CommentService {

  constructor(private http: HttpClient) { }
	insertComment(comment: Comment) {
		const body = { comment: comment };
		return this.http.post(environment.baseServerURL + '/comments/', body, { withCredentials: true }).
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

	getMessagesWithUser(userId): Observable<any[]> {
		return this.http.get(environment.baseServerURL + '/mentions/' + userId, {
			withCredentials: true
		}).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}

	removeMentionsNofication(userId): Observable<any[]> {
		return this.http.delete(environment.baseServerURL + '/mentions/' + userId, {
			withCredentials: true
		}).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
}
