import { Injectable } from '@angular/core';

@Injectable()
export class DateHelperService {

  constructor() { }

	getDateFormat(dateIn) {
		debugger;
		return dateIn.toLocaleString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' }).
			replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
	}

	getDateTimeFormat(dateIn) {
		return dateIn.toLocaleString();
	}

	getTimeFormat(dateIn) {
		return this.getDateTimeFormat(dateIn).slice(12);
	}
}
