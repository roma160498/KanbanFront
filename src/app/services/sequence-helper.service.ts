import { Injectable } from '@angular/core';

@Injectable()
export class SequenceHelperService {

	constructor() { }

	getSequenceFor(prefix, numbersAmount, value) {
		if (value) {
			const zeroAmount = numbersAmount - value.toString().length;
			let zeroString = '';
			for (let i = 0; i < zeroAmount; i++) {
				zeroString += '0';
			}
			return prefix + zeroString + value;
		}
	}

}
