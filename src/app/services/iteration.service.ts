import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Iteration } from '../models/iteration';
import { DateHelperService } from './date-helper.service';
import { SequenceHelperService } from './sequence-helper.service';
import { Issue } from '../models/issue';
import { environment } from '../../environments/environment';

@Injectable()
export class IterationService {

  constructor(private http: HttpClient, private dateHelper: DateHelperService,
  private sequenceHelper: SequenceHelperService) { }
  getIteration(args): Observable<Iteration[]> {
		return this.http.get(environment.baseServerURL + '/iterations', {
			withCredentials: true, params: {
				'amount': args.amount,
				'offset': args.offset,
				'properties': args.properties
			}
		}).
			map((response: any[]) => {
        response.forEach(element => {
          element.increment_number = this.sequenceHelper.getSequenceFor('PI-', 6, element.increment_id);
          element.number = this.sequenceHelper.getSequenceFor('IT-', 6, element.id);
					element.end_date = this.dateHelper.getDateFormat((new Date(element.end_date)));
					element.start_date = this.dateHelper.getDateFormat((new Date(element.start_date)));
				});
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
	getIterationCount(args): Observable<any> {
		return this.http.get(environment.baseServerURL + '/iterations', {
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
	insertIteration(iteration: Iteration, userName) {
		const body = { iteration: iteration, userName };
		return this.http.post(environment.baseServerURL + '/iterations/', body, { withCredentials: true }).
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
	deleteIteration(args) {
		return this.http.delete(environment.baseServerURL + '/iterations/' + args.id, { withCredentials: true }).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
	updateIteration(iteration: Iteration, id, diff, userName) {
		const body = { iteration: iteration, diff, userName };
		return this.http.put(environment.baseServerURL + '/iterations/' + id, body, { withCredentials: true }).
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
	getIssuesOfIteration(args, featureId): Observable<Issue[]> {
		return this.http.get(environment.baseServerURL + '/iterations/' + featureId + '/issues', {
			withCredentials: true, params: {
				'amount': args.amount,
				'offset': args.offset,
				'properties': args.properties
			}
		}).
		map((response: Issue[]) => {
			response.forEach(element => {
				element.user_fullname = (element.user_name || '') + ' ' + (element.user_surname || '');
				element.number = this.sequenceHelper.getSequenceFor('I-', 6, element.id);
				element.feature_number = this.sequenceHelper.getSequenceFor('F-', 6, element.feature_id);
				element.isClosed = !!element.closed_on;
			});
			return response
		}).catch(e => {
			return Observable.throw(e);
		});
	}
	getIssuesOfIterationCount(args, featureId): Observable<Issue[]> {
		return this.http.get(environment.baseServerURL + '/iterations/' + featureId + '/issues', {
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
	getIterationStates(): Observable<any[]> {
		return this.http.get(environment.baseServerURL + '/iterationstates/', {
			withCredentials: true
		}).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
}
