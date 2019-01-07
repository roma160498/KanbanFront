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
	loading: boolean;
	scrollHeight: string;
	selectedIterations: Iteration[];
	selectedIteration: Iteration;
	rowsAmount: number = 25;
	isTableDisplayed: boolean = true;

	constructor(private iterationService: IterationService, private el: ElementRef, private messageService: MessageService) { }

	ngOnInit() {
		this.iterationService.getIterationCount({}).subscribe(res => {
			this.amountOfIterations = res[0]['sum'];
		});
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
		this.loading = true;
	}

	_isScrollExist(element): boolean {
		return element.scrollHeight > parseInt(this.scrollHeight);
	}

	rowsAmountChangeHandler(amount, aaa) {
		this.table['__proto__'].reset.call(this.table);
		this.rowsAmount = amount === -1 ? this.amountOfIterations : amount;
		this.loadIterationsLazy({
			first: 0,
			rows: this.rowsAmount
		});
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
		}
	}

	ngOnChanges(changes: SimpleChange) {
		if (changes['updatedIteration']) {
			const iteration = changes['updatedIteration'];
			if (iteration.currentValue && iteration.currentValue.isNew) {
				this.iterations.push(iteration.currentValue.iteration);
				this.amountOfIterations++;
				this.table['__proto__'].reset.call(this.table);
				const name = iteration.currentValue.iteration.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Iteration ${name} created successfully.` });
			}
			if (iteration.currentValue && !iteration.currentValue.isNew) {
				const updatedIteration = this.iterations.find((value, index) => iteration.currentValue.iterationID == value.id);
				for (let key of Object.keys(iteration.currentValue.updatedProps)) {
					updatedIteration[key] = iteration.currentValue.updatedProps[key];
				}
				this.table['__proto__'].reset.call(this.table);
				const name = iteration.currentValue.updatedProps.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Iteration ${name} updated successfully.` });
			}
		}
	}

	onSelectUnselectRow(event) {
		this.selectedIterationsOut.emit(this.selectedIterations);
	}

	_refreshGrid(table) {
		this.iterationService.getIterationCount({}).subscribe(res => {
			this.amountOfIterations = res[0]['sum'];
		});
		this.loading = true;
		this.loadIterationsLazy({
			first: table.first,
			rows: this.rowsAmount
		});
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
				this.table['__proto__'].reset.call(this.table);
				this.showSuccess(name);
			});
		}
		this.selectedIterations = [];
		this.selectedIterationsOut.emit(this.selectedIterations);
	}

	showSuccess(name) {
		this.messageService.add({ severity: 'success', summary: 'Success', detail: `Iteration ${name} deleted successfully.` });
	}

	loadIterationsLazy(event) {
		this.loading = true;
		this.iterationService.getIteration({
			offset: event.first,
			amount: event.rows
		}).subscribe(iterations => {
			this.iterations = iterations;
			this.loading = false;
		});
	}
}
