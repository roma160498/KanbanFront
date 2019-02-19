import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Increment } from '../models/increment';
import { DateHelperService } from './date-helper.service';
import { SequenceHelperService } from './sequence-helper.service';
import { Iteration } from '../models/iteration';
import { Feature } from '../models/feature';

@Injectable()
export class IncrementService {

	constructor(private http: HttpClient, private dateHelper: DateHelperService,
		private sequenceHelper: SequenceHelperService) { }
	getIncrement(args): Observable<Increment[]> {
		return this.http.get('http://localhost:3000/increments', {
			withCredentials: true, params: {
				'amount': args.amount,
				'offset': args.offset,
				'properties': args.properties
			}
		}).
			map((response: any[]) => {
				response.forEach(element => {
					element.number = this.sequenceHelper.getSequenceFor('PI-', 6, element.id);
					element.end_date = this.dateHelper.getDateFormat((new Date(element.end_date)));
					element.start_date = this.dateHelper.getDateFormat((new Date(element.start_date)));
				});
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
	getIncrementCount(args): Observable<any> {
		return this.http.get('http://localhost:3000/increments', {
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
	insertIncrement(increment: Increment) {
		const body = { increment: increment };
		return this.http.post('http://localhost:3000/increments/', body, { withCredentials: true }).
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
	deleteIncrement(args) {
		return this.http.delete('http://localhost:3000/increments/' + args.id, { withCredentials: true }).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
	updateIncrement(increment: Increment, id) {
		const body = { increment: increment };
		return this.http.put('http://localhost:3000/increments/' + id, body, { withCredentials: true }).
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
	getIterationsOfIncrementCount(args, incrementId): Observable<Iteration[]> {
		return this.http.get('http://localhost:3000/increments/' + incrementId + '/iterations', {
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
	getIterationsOfIncrement(args, incrementId): Observable<Iteration[]> {
		return this.http.get('http://localhost:3000/increments/' + incrementId + '/iterations', {
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
	getFeaturesOfIncrementCount(args, featureId): Observable<Feature[]> {
		return this.http.get('http://localhost:3000/increments/' + featureId + '/features', {
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
	getFeaturesOfIncrement(args, featureId): Observable<Feature[]> {
		return this.http.get('http://localhost:3000/increments/' + featureId + '/features', {
			withCredentials: true, params: {
				'amount': args.amount,
				'offset': args.offset,
				'properties': args.properties
			}
		}).
			map((response: any[]) => {
				response.forEach(element => {
					element.number = this.sequenceHelper.getSequenceFor('F-', 6, element.id);
					element.increment_number = this.sequenceHelper.getSequenceFor('PI-', 6, element.increment_id);
				});
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
	getIncrementStates() : Observable<any[]>{
		return this.http.get('http://localhost:3000/incrementstates/', {
			withCredentials: true
		}).
			map((response: any[]) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
}
