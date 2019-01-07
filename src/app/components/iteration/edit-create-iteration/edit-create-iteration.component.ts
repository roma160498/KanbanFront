import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Iteration } from '../../../models/iteration';
import { RelationshipTableComponent } from '../../global/relationship-table/relationship-table.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { IterationService } from '../../../services/iteration.service';
import { IncrementService } from '../../../services/increment.service';
import { DateHelperService } from '../../../services/date-helper.service';
import { Subject } from 'rxjs';
@Component({
	selector: 'app-edit-create-iteration',
	templateUrl: './edit-create-iteration.component.html',
	styleUrls: ['./edit-create-iteration.component.css'],
	providers: [MessageService]
})
export class EditCreateIterationComponent implements OnInit {
	selectedIteration: Iteration;
	id: number;
	name: string = '';
	number: string = '';
	start_date: Date;
	end_date: Date;
	story_points: number;
	completeness: number;
	selectedIterations: Iteration[];
	editMode: string;
	@ViewChild('relationTable') relTableComponent: RelationshipTableComponent;

	incrementList: any = {};
	increment_id: any;
	minDate: Date;
	maxDate: Date;
	isCalendarDisabled: Boolean = true;
	completePercent: number = 0;
	isPopupMode: Boolean = false;
	popupComponent: any;
	@Output() isSavedResultSuccesOutInPopupMode: Subject<boolean> = new Subject();

	@Output() updatedIterationOut: EventEmitter<any> = new EventEmitter();
	@Output() isSavedResultSuccesOut: EventEmitter<boolean> = new EventEmitter();
	constructor(private iterationService: IterationService, private messageService: MessageService,
		private incrementService: IncrementService, private dateHelper: DateHelperService) { }
	ngOnInit() {
		this.incrementService.getIncrement({}).subscribe(items => {
			this.incrementList.list = items;
			this.incrementList.options = items.map(el => {
				return {
					label: `PI-${el.id} ${el.name} (${el.start_date} to ${el.end_date})`,
					value: el.id
				}
			})
		});
	}
	toolbarActionHandler(action) {
		debugger;
		const iteration = new Iteration();
		if (action === 'save') {
			if (this._isInputDataInvalid()) {
				this.messageService.add({ severity: 'error', summary: 'Error', detail: `Some of required fields are empty.` });
				return;
			}
			if (this.editMode === 'add') {
				iteration.name = this.name;
				iteration.start_date = this.dateHelper.getDateFormat(this.start_date);
				iteration.end_date = this.dateHelper.getDateFormat(this.end_date);
				iteration.increment_id = this.increment_id;
				iteration.status_id = 1;// MOCK
				iteration.story_points = 0;// mock
				iteration.completeness = 0;// mock
				this.iterationService.insertIteration(iteration).subscribe((result) => {
					if (result) {
						this.updatedIterationOut.emit({
							isNew: true,
							iteration: iteration
						});
						this.isSavedResultSuccesOut.emit(true);
						this._clearForm();
						if (this.isPopupMode) {
							this.popupComponent.destroy();
							this.isSavedResultSuccesOutInPopupMode.next(true);
						}
					} else {
						this.isSavedResultSuccesOut.emit(false);
						this.messageService.add({ severity: 'error', summary: 'Error', detail: `Iteration with ${this.name} name can not be created.` });
					}
				})
			} else if (this.editMode === 'edit') {

				for (let key in this.selectedIteration) {
					if (this[key] !== this.selectedIteration[key] && key != 'id') {
						iteration[key] = this[key]
					}
				}
				iteration.start_date = this.dateHelper.getDateFormat(this.start_date);
				iteration.end_date = this.dateHelper.getDateFormat(this.end_date);
				this.iterationService.updateIteration(iteration, this.selectedIteration.id).subscribe((result) => {
					if (result) {
						this.updatedIterationOut.emit({
							isNew: false,
							iterationID: this.selectedIteration.id,
							updatedProps: iteration
						});
						this.isSavedResultSuccesOut.emit(true);
						this._clearForm();
					} else {
						this.isSavedResultSuccesOut.emit(false);
						this.messageService.add({ severity: 'error', summary: 'Error', detail: `Iteration with ${this.name} name can not be updated.` });
					}
				})
			}
			this.editMode === action;
		}

		if (action === 'add' || action === 'edit') {
			this.editMode = action;
		}
	}

	_isInputDataInvalid() {
		return this.name === '' || !this.start_date || !this.end_date || !this.increment_id;
	}

	_clearForm() {
		this.name = '';
		delete this.start_date;
		delete this.end_date;
		this.number = '';
		this.increment_id = '';
		delete this.minDate;
		delete this.maxDate;
		this.isCalendarDisabled = true;
		this.completePercent = 0;
	}

	saveItself() {
		this.editMode = 'add';
		this.toolbarActionHandler('save');
	}
	discard() {
		if (this.isPopupMode) {
			this.isSavedResultSuccesOutInPopupMode.next(false);
			this.popupComponent.destroy();
		} else {
			this._clearForm();
			this.isSavedResultSuccesOut.emit(true);
			this.editMode = null;
		}
	}

	incrementSelectHandler(event) {
		for (let i = 0; i < this.incrementList.list.length; i++) {
			if (this.incrementList.list[i].id === event.value) {
				this.minDate = new Date(this.incrementList.list[i].start_date);
				this.maxDate = new Date(this.incrementList.list[i].end_date);
				delete this.start_date;
				delete this.end_date;
				this.isCalendarDisabled = false;
				break;
			}
		}
	}
}
