import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Iteration } from '../models/iteration';
import { DateHelperService } from './date-helper.service';
import { SequenceHelperService } from './sequence-helper.service';

@Injectable()
export class IterationService {

  constructor(private http: HttpClient, private dateHelper: DateHelperService,
  private sequenceHelper: SequenceHelperService) { }
  getIteration(args): Observable<Iteration[]> {
		return this.http.get('http://localhost:3000/iterations', {
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
		return this.http.get('http://localhost:3000/iterations', {
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
	insertIteration(iteration: Iteration) {
		const body = { iteration: iteration };
		return this.http.post('http://localhost:3000/iterations/', body, { withCredentials: true }).
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
		return this.http.delete('http://localhost:3000/iterations/' + args.id, { withCredentials: true }).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
	updateIteration(iteration: Iteration, id) {
		const body = { iteration: iteration };
		return this.http.put('http://localhost:3000/iterations/' + id, body, { withCredentials: true }).
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
