import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Feature } from '../models/feature';
import { SequenceHelperService } from './sequence-helper.service';
import { Issue } from '../models/issue';

@Injectable()
export class FeatureService {

  constructor(private http: HttpClient, private sequenceHelper: SequenceHelperService) { }
  getFeatureCount(args): Observable<any> {
		return this.http.get('http://localhost:3000/features', {
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
		return this.http.get('http://localhost:3000/features', {
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
				});
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
	insertFeature(feature: Feature) {
		const body = { feature: feature };
		return this.http.post('http://localhost:3000/features/', body, { withCredentials: true }).
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
	updateFeature(feature: Feature, id) {
		const body = { feature: feature };
		return this.http.put('http://localhost:3000/features/' + id, body, { withCredentials: true }).
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
		return this.http.delete('http://localhost:3000/features/' + args.id, { withCredentials: true }).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
	getFeatureClassification(args): Observable<Feature[]> {
		return this.http.get('http://localhost:3000/featureclassifications', {
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
		return this.http.get('http://localhost:3000/features/' + featureId + '/issues', {
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
			});
			return response
		}).catch(e => {
			return Observable.throw(e);
		});
	}
	getIssuesOfFeatureCount(args, featureId): Observable<Issue[]> {
		return this.http.get('http://localhost:3000/features/' + featureId + '/issues', {
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
}
