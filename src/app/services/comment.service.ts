import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Comment } from '../models/comment';

@Injectable()
export class CommentService {

  constructor(private http: HttpClient) { }
	insertComment(comment: Comment) {
		const body = { comment: comment };
		return this.http.post('http://localhost:3000/comments/', body, { withCredentials: true }).
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
		return this.http.get('http://localhost:3000/mentions/' + userId, {
			withCredentials: true
		}).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}

	removeMentionsNofication(userId): Observable<any[]> {
		return this.http.delete('http://localhost:3000/mentions/' + userId, {
			withCredentials: true
		}).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
}
