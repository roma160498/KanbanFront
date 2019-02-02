import { Component, OnInit, ViewChild, EventEmitter, Output, Input, ElementRef, SimpleChange } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { TableModule } from 'primeng/table';
import { Iteration } from '../../../models/iteration';
import { IterationService } from '../../../services/iteration.service';

@Component({
	selector: 'app-table-iterations',
	templateUrl: './table-iterations.component.html',
	styleUrls: ['./table-iterations.component.css'],
	providers: [MessageService]
})
export class TableIterationsComponent implements OnInit {

	@ViewChild('table') table: TableModule;
	@Output() selectedIterationsOut: EventEmitter<Iteration[]> = new EventEmitter();
	@Input() updatedIteration: any;

	amountOfIterations: number;
	cols: any[];
	iterations: Iteration[];
	scrollHeight: string;
	selectedIterations: Iteration[];
	selectedIteration: Iteration;
	rowsAmount: number = 25;
	isTableDisplayed: boolean = true;
	searchIsVisible: boolean = true;

	constructor(private iterationService: IterationService, private el: ElementRef, private messageService: MessageService) { }

	ngOnInit() {
		this.cols = [
			{ field: 'number', header: 'Iteration number' },
			{ field: 'name', header: 'Iteration name' },
			{ field: 'increment_name', header: 'PI' },
			{ field: 'increment_number', header: 'PI number' },
			{ field: 'start_date', header: 'Started On' },
			{ field: 'end_date', header: 'Ended On' },
			{ field: 'story_points', header: 'Story points' },
			{ field: 'status_name', header: 'Status' }
		];
		this.iterationService.getIteration({}).subscribe(iterations => {
			this.amountOfIterations = iterations.length;
			this.iterations = iterations;
		});
	}

	_isScrollExist(element): boolean {
		return element.scrollHeight > parseInt(this.scrollHeight);
	}

	rowsAmountChangeHandler(amount, aaa) {
		this.resetTable();
		this.rowsAmount = amount === -1 ? this.amountOfIterations : amount;
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
				this.selectedIterations = [];
				this.selectedIterationsOut.emit(this.selectedIterations);
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
		if (changes['updatedIteration']) {
			const iteration = changes['updatedIteration'];
			if (iteration.currentValue && iteration.currentValue.isNew) {
				this.iterations.push(iteration.currentValue.iteration);
				this.amountOfIterations++;
				this.resetTable();
				const name = iteration.currentValue.iteration.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Iteration ${name} created successfully.` });
			}
			if (iteration.currentValue && !iteration.currentValue.isNew) {
				const updatedIteration = this.iterations.find((value, index) => iteration.currentValue.iterationID == value.id);
				for (let key of Object.keys(iteration.currentValue.updatedProps)) {
					if (iteration.currentValue.updatedProps[key]) {
						updatedIteration[key] = iteration.currentValue.updatedProps[key];
					}
				}
				this.resetTable();
				const name = iteration.currentValue.updatedProps.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Iteration ${name} updated successfully.` });
			}
		}
	}

	onSelectUnselectRow(event) {
		this.selectedIterationsOut.emit(this.selectedIterations);
	}

	_refreshGrid(table) {
		this.iterationService.getIteration({}).subscribe(iterations => {
			this.amountOfIterations = iterations.length;
			this.iterations = iterations;
		});
		this.clearFilterInputs();
	}

	_deleteItem(table) {
		for (let i = 0; i < this.selectedIterations.length; i++) {
			const arrayIndex = this.iterations.indexOf(this.selectedIterations[i]);
			this.iterations = this.iterations.filter((value, index) => arrayIndex != index);
			const selectedId = this.selectedIterations[i].id;
			this.amountOfIterations--;
			this.selectedIterations
			const name = this.selectedIterations[i].name;
			this.iterationService.deleteIteration({ id: selectedId }).subscribe(res => {
				this.resetTable();
				this.showSuccess(name);
			});
		}
		this.selectedIterations = [];
		this.selectedIterationsOut.emit(this.selectedIterations);
	}

	showSuccess(name) {
		this.messageService.add({ severity: 'success', summary: 'Success', detail: `Iteration ${name} deleted successfully.` });
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
