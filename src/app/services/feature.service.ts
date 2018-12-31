import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Feature } from '../models/feature';

@Injectable()
export class FeatureService {

  constructor(private http: HttpClient) { }
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
			map((response: Response) => {
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
}
