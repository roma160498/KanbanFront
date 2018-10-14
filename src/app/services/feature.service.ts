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
}
