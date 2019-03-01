import { Injectable } from '@angular/core';
import { Issue } from '../models/issue';
import { HttpClient } from '@angular/common/http';
import { DateHelperService } from './date-helper.service';
import { SequenceHelperService } from './sequence-helper.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IssueService {

	constructor(private http: HttpClient, private dateHelper: DateHelperService,
		private sequenceHelper: SequenceHelperService) { }
	getIssue(args): Observable<Issue[]> {
		return this.http.get('http://localhost:3000/issues', {
			withCredentials: true, params: {
				'amount': args.amount,
				'offset': args.offset,
				'properties': args.properties
			}
		}).
			map((response: Issue[]) => {
				response.forEach(element => {
					element.user_fullname = element.user_login ? element.user_name === '' || element.user_surname === '' ? element.user_login : `${element.user_name} ${element.user_surname}` : ' ';
					element.number = this.sequenceHelper.getSequenceFor('I-', 6, element.id);
					element.feature_number = this.sequenceHelper.getSequenceFor('F-', 6, element.feature_id);
					element.iteration_number = this.sequenceHelper.getSequenceFor('IT-', 6, element.iteration_id);
				});
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
	getIssueCount(args): Observable<any> {
		return this.http.get('http://localhost:3000/issues', {
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
	insertIssue(issue: Issue) {
		const body = { issue: issue };
		return this.http.post('http://localhost:3000/issues/', body, { withCredentials: true }).
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
	deleteIssue(args) {
		return this.http.delete('http://localhost:3000/issues/' + args.id, { withCredentials: true }).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
	updateIssue(issue: Issue, id) {
		const body = { issue: issue };
		return this.http.put('http://localhost:3000/issues/' + id, body, { withCredentials: true }).
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
  getIssueClassification(args): Observable<any[]> {
	return this.http.get('http://localhost:3000/issueclassifications', {
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

	_fixCommentProps(comments) {
		comments.forEach(element => {
			const dateTimeObject = this.dateHelper.getDateTimeFormat(new Date(element.date));
			element.date = this.dateHelper.getDateTimeFormat(new Date(element.date));
			element.user_name = element.login ? element.name === '' || element.surname === '' ? element.login : `${element.name} ${element.surname}` : ' ';
			this._fixCommentProps(element.comments);
		});
		comments.reverse();
	}
	getComments(issueId): Observable<any[]> {
		return this.http.get(`http://localhost:3000/issues/${issueId}/comments`, {
			withCredentials: true
		}).
			map((response: any) => {
				this._fixCommentProps(response);
				return response;
			}).catch(e => {
				return Observable.throw(e);
			});
	}
}