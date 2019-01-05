import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Product } from '../models/product';
import { DateHelperService } from './date-helper.service';

@Injectable()
export class ProductService {
	constructor(private http: HttpClient, private dateHelper: DateHelperService) { }
	getProduct(args): Observable<Product[]> {
		return this.http.get('http://localhost:3000/products', {
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
		return this.http.get('http://localhost:3000/products', {
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
	insertProduct(product: Product) {
		const body = { product: product };
		return this.http.post('http://localhost:3000/products/', body, { withCredentials: true }).
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
		return this.http.delete('http://localhost:3000/products/' + args.id, { withCredentials: true }).
			map((response: Response) => {
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
	updateProduct(product: Product, id) {
		const body = { product: product };
		return this.http.put('http://localhost:3000/products/' + id, body, { withCredentials: true }).
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
		return this.http.get('http://localhost:3000/products/' + productId + '/features', {
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
		return this.http.get('http://localhost:3000/products/' + productId + '/features', {
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
	getIncrementsOfProductCount(args, productId): Observable<Product[]> {
		return this.http.get('http://localhost:3000/products/' + productId + '/increments', {
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
		return this.http.get('http://localhost:3000/products/' + productId + '/increments', {
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
					element.end_date = this.dateHelper.getDateFormat((new Date(element.end_date)));
					element.start_date = this.dateHelper.getDateFormat((new Date(element.start_date)));
				});
				return response
			}).catch(e => {
				return Observable.throw(e);
			});
	}
}
