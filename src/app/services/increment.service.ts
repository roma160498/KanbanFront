import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Increment } from '../models/increment';

@Injectable()
export class IncrementService {

  constructor(private http: HttpClient) { }
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
					debugger;
					const zeroAmount = 6 - element.id.toString().length;
					let zeroString = '';
					for (let i = 0; i < zeroAmount; i++) {
						zeroString += '0';
					}
					element.number = 'PI-' + zeroString + element.id;
					element.end_date = this.getDateFormat((new Date(element.end_date)));
					element.start_date = this.getDateFormat((new Date(element.start_date)));
				});
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
	getDateFormat(dateIn) {
		return dateIn.toLocaleString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' }).
			replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
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
		const body = { increment:increment };
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
}
