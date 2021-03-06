import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Product } from '../models/product';
import { DateHelperService } from './date-helper.service';
import { Feature } from '../models/feature';
import { SequenceHelperService } from './sequence-helper.service';
import { environment } from '../../environments/environment';

@Injectable()
export class ProductService {
	constructor(private http: HttpClient, private dateHelper: DateHelperService, private sequenceHelper: SequenceHelperService) { }
	getProduct(args): Observable<Product[]> {
		return this.http.get(environment.baseServerURL + '/products', {
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
	getProductCount(args): Observable<any> {
		return this.http.get(environment.baseServerURL + '/products', {
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
	insertProduct(product: Product, userName) {
		const body = { product, userName };
		return this.http.post(environment.baseServerURL + '/products/', body, { withCredentials: true }).
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
	deleteProduct(args) {
		return this.http.delete(environment.baseServerURL + '/products/' + args.id, { withCredentials: true }).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
	updateProduct(product: Product, id, diff, userName) {
		const body = { product: product, diff: diff, userName };
		return this.http.put(environment.baseServerURL + '/products/' + id, body, { withCredentials: true }).
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
	getFeaturesOfProductCount(args, productId): Observable<Product[]> {
		return this.http.get(environment.baseServerURL + '/products/' + productId + '/features', {
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
	getFeaturesOfProduct(args, productId): Observable<Product[]> {
		return this.http.get(environment.baseServerURL + '/products/' + productId + '/features', {
			withCredentials: true, params: {
				'amount': args.amount,
				'offset': args.offset,
				'properties': args.properties
			}
		}).
		map((response: Feature[]) => {
			response.forEach(element => {
				element.increment_number = this.sequenceHelper.getSequenceFor('PI-', 6, element.increment_id);
				element.isClosed = !!element.closed_on;
				
			});
			return response
		}).catch(e => {
			return Observable.throw(e);
		});
	}
	getIncrementsOfProductCount(args, productId): Observable<Product[]> {
		return this.http.get(environment.baseServerURL + '/products/' + productId + '/increments', {
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
	getIncrementsOfProduct(args, productId): Observable<Product[]> {
		return this.http.get(environment.baseServerURL + '/products/' + productId + '/increments', {
			withCredentials: true, params: {
				'amount': args.amount,
				'offset': args.offset,
				'properties': args.properties
			}
		}).
			map((response: any[]) => {
				response.forEach(element => {
					const zeroAmount = 6 - element.id.toString().length;
					let zeroString = '';
					for (let i = 0; i < zeroAmount; i++) {
						zeroString += '0';
					}
					element.number = 'PI-' + zeroString + element.id;
					element.end_date = this.dateHelper.getDateFormat((new Date(element.end_date)));
					element.start_date = this.dateHelper.getDateFormat((new Date(element.start_date)));
				});
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
}
