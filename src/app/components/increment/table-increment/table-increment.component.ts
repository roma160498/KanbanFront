import { Component, OnInit, ViewChild, Output, Input, EventEmitter, ElementRef, SimpleChange } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Increment } from '../../../models/increment';
import { IncrementService } from '../../../services/increment.service';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
	selector: 'app-table-increment',
	templateUrl: './table-increment.component.html',
	styleUrls: ['./table-increment.component.css'],
	providers: [MessageService]
})
export class TableIncrementComponent implements OnInit {

	@ViewChild('table') table: TableModule;
	@Output() selectedIncrementsOut: EventEmitter<Increment[]> = new EventEmitter();
	@Input() updatedIncrement: any;
	@Input() canGet: boolean;

	amountOfIncrements: number;
	cols: any[];
	increments: Increment[] = [];
	loading: boolean;
	scrollHeight: string;
	selectedIncrements: Increment[];
	selectedIncrement: Increment;
	rowsAmount: number = 25;
	isTableDisplayed: boolean = true;
	searchIsVisible: boolean = true;

	constructor(private incrementService: IncrementService, private el: ElementRef, private messageService: MessageService) { }

	ngOnInit() {
		this.cols = [
			{ field: 'number', header: 'Number' },
			{ field: 'name', header: 'Name' },
			{ field: 'product_name', header: 'Product' },
			{ field: 'start_date', header: 'Started On' },
			{ field: 'end_date', header: 'Ended On' },
			{ field: 'status_name', header: 'Status' }
		];
		this.getPIs();
	}

	getPIs() {
		if (this.canGet) {
			this.incrementService.getIncrement({}).subscribe(increments => {
				this.amountOfIncrements = increments.length;
				this.increments = increments;
			});
		}
	}

	_isScrollExist(element): boolean {
		return element.scrollHeight > parseInt(this.scrollHeight);
	}

	rowsAmountChangeHandler(amount, aaa) {
		this.resetTable();
		this.rowsAmount = amount === -1 ? this.amountOfIncrements : amount;
	}

	toolbarActionHandler(action, table) {
		switch (action) {
			case 'delete': {
				this._deleteItem(table);
				break;
			}
			case 'refresh': {
				this._refreshGrid(table);
				break;
			}
			case 'add': {
				break;
			}
			case 'save': {
				this.selectedIncrements = [];
				this.selectedIncrementsOut.emit(this.selectedIncrements);
				break;
			}
			case 'filter': {
				this.searchIsVisible = !this.searchIsVisible;
				if (!this.searchIsVisible) {
					this.clearFilterInputs();
				}
			}
		}
	}

	ngOnChanges(changes: SimpleChange) {
		if (changes['updatedIncrement']) {
			const increment = changes['updatedIncrement'];
			if (increment.currentValue && increment.currentValue.isNew) {
				this.increments.push(increment.currentValue.increment);
				this.amountOfIncrements++;
				this.resetTable();
				const name = increment.currentValue.increment.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Increment "${name}" created successfully.` });
			}
			if (increment.currentValue && !increment.currentValue.isNew) {
				const updatedIncrement = this.increments.find((value, index) => increment.currentValue.incrementID == value.id);
				for (let key of Object.keys(increment.currentValue.updatedProps)) {
					if (increment.currentValue.updatedProps[key] !== undefined) {
						updatedIncrement[key] = increment.currentValue.updatedProps[key];
					}
				}
				this.resetTable();
				const name = increment.currentValue.updatedProps.name || increment.currentValue.keyed_name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Increment "${name}" updated successfully.` });
			}
		}
	}

	onSelectUnselectRow(event) {
		this.selectedIncrementsOut.emit(this.selectedIncrements);
	}

	_refreshGrid(table) {
		this.getPIs();
		this.clearFilterInputs();
	}

	_deleteItem(table) {
		for (let i = 0; i < this.selectedIncrements.length; i++) {
			const arrayIndex = this.increments.indexOf(this.selectedIncrements[i]);
			this.increments = this.increments.filter((value, index) => arrayIndex != index);
			const selectedId = this.selectedIncrements[i].id;
			this.amountOfIncrements--;
			this.selectedIncrements
			const name = this.selectedIncrements[i].name;
			this.incrementService.deleteIncrement({ id: selectedId }).subscribe(res => {
				this.resetTable();
				this.showSuccess(name);
			});
		}
		this.selectedIncrements = [];
		this.selectedIncrementsOut.emit(this.selectedIncrements);
	}

	showSuccess(name) {
		this.messageService.add({ severity: 'success', summary: 'Success', detail: `Increment ${name} deleted successfully.` });
	}

	resetTable() {
		this.table['__proto__'].reset.call(this.table);
		this.clearFilterInputs();
	}

	clearFilterInputs() {
		const filters = document.getElementsByClassName('filterInput');
		for (let i = 0; i < filters.length; i++) {
			(<HTMLInputElement>filters[i]).value = '';
			this.table['__proto__'].filter.call(this.table, '', this.cols[i].field);
		}
	}
}
