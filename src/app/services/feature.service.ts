import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Feature } from '../models/feature';
import { SequenceHelperService } from './sequence-helper.service';
import { Issue } from '../models/issue';
import { DateHelperService } from './date-helper.service';
import { environment } from '../../environments/environment';

@Injectable()
export class FeatureService {

  constructor(private http: HttpClient, private sequenceHelper: SequenceHelperService,
	private dateHelper: DateHelperService) { }
  getFeatureCount(args): Observable<any> {
		return this.http.get(environment.baseServerURL + '/features', {
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
  getFeature(args): Observable<Feature[]> {
		return this.http.get(environment.baseServerURL + '/features', {
			withCredentials: true, params: {
				'amount': args.amount,
				'offset': args.offset,
				'properties': args.properties
			}
		}).
			map((response: Feature[]) => {
				response.forEach(element => {
					element.number = this.sequenceHelper.getSequenceFor('F-', 6, element.id);
					element.increment_number = this.sequenceHelper.getSequenceFor('PI-', 6, element.increment_id);
					element.isClosed = !!element.closed_on;
					element.closed_on = element.closed_on ? this.dateHelper.getDateFormat(new Date(element.closed_on)) + ' ' + this.dateHelper.getTimeFormat(new Date(element.closed_on)) : null;
					element.created_on = element.created_on ? this.dateHelper.getDateFormat(new Date(element.created_on)) + ' ' + this.dateHelper.getTimeFormat(new Date(element.created_on)): null;
					element.modified_on = element.modified_on ? this.dateHelper.getDateFormat(new Date(element.modified_on)) + ' ' + this.dateHelper.getTimeFormat(new Date(element.modified_on)): null;
				});
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
	insertFeature(feature: Feature, userName) {
		const body = { feature: feature, userName };
		return this.http.post(environment.baseServerURL + '/features/', body, { withCredentials: true }).
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
	updateFeature(feature: Feature, id, diff, userName) {
		const body = { feature: feature, diff, userName };
		return this.http.put(environment.baseServerURL + '/features/' + id, body, { withCredentials: true }).
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
	deleteFeature(args) {
		return this.http.delete(environment.baseServerURL + '/features/' + args.id, { withCredentials: true }).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
	getFeatureClassification(args): Observable<Feature[]> {
		return this.http.get(environment.baseServerURL + '/featureclassifications', {
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
	getIssuesOfFeature(args, featureId): Observable<Issue[]> {
		return this.http.get(environment.baseServerURL + '/features/' + featureId + '/issues', {
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
				element.iteration_number = this.sequenceHelper.getSequenceFor('IT-', 6, element.iteration_id);
				element.isClosed = !!element.closed_on;
			});
			return response
		}).catch(e => {
			return Observable.throw(e);
		});
	}
	getIssuesOfFeatureCount(args, featureId): Observable<Issue[]> {
		return this.http.get(environment.baseServerURL + '/features/' + featureId + '/issues', {
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
	getFeatureStates(): Observable<any[]> {
		return this.http.get(environment.baseServerURL + '/featurestates/', {
			withCredentials: true
		}).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
}
