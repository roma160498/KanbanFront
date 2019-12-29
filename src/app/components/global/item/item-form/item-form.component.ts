import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { InputComponent } from '../../controls/input/input.component';
import { DateHelperService } from '../../../../services/date-helper.service';
import { RelationshipTableComponent } from '../../relationship-table/relationship-table.component';

@Component({
	selector: 'app-item-form',
	templateUrl: './item-form.component.html',
	styleUrls: ['./item-form.component.css'],
	providers: [MessageService]
})
export class ItemFormComponent implements OnInit {
	@Input() settings: any;
	@Input() singularLabel: string;
	@Input() serviceIsLoaded: any;
	controls: any = [];
	ngModel: any = {};
	@Output() isSavedResultSuccesOut: EventEmitter<boolean> = new EventEmitter();
	@Input() itemService: any;
	@Input() typeName: string;
	editMode: string;
	@Output() updatedItemOut: EventEmitter<any> = new EventEmitter();
	isPopupMode: Boolean = false;
	@Input() selectedItem: any;
	currentUserIsAdmin: boolean;
	relationshipTabs: any = [];
	@ViewChild('relationTable') relTableComponent: RelationshipTableComponent;

	@Input() rowsOnItemForm: any;
	@Input() relationshipsSettings: any;
	@Input() permissions: any;
	
	@Input() relatedServices: any;
	sourceFieldItems: any = {};
	dropdownValues: any = {};

	componentsMap: object = {
		'text': InputComponent
	};

	formDescriptor: FormGroup = new FormGroup({});

	constructor(private messageService: MessageService, private dateHelper: DateHelperService) { }

	ngOnInit() {
		this._buildForm();
		this.currentUserIsAdmin = localStorage.getItem('is_admin') === '1';
	}

	_initDropDowns() {
		debugger;
		for (let name in this.relatedServices) {
			const method = name[0].toUpperCase() + name.slice(1);
			this.relatedServices[name][`get${method}`]({}).subscribe(items => {
				this.sourceFieldItems[name] = {};
				this.sourceFieldItems[name].items = items;
				this.sourceFieldItems[name].options = items.map(el => {
					return {
						label: el.name,
						value: el.id
					}
				});
			});
		}
		this.controls.forEach(element => {
			if (element.type === 'dropdown') {
				this.itemService[element.getMethod]({}).subscribe(items => {
					this.dropdownValues[element.field] = {};
					this.dropdownValues[element.field].options = items.map(el => {
						return {
							label: el.name,
							value: el.id
						}
					});
				});
			}
		});

		debugger;
	}

	ngOnChanges(changes: SimpleChange) {
		if (changes['serviceIsLoaded']) {
			const value = changes['serviceIsLoaded'];
			if (value.currentValue) {
				this._initDropDowns();
			} else {
				return;
			}
		}
	}

	_buildForm() {
		this.controls = this.settings.cols;
		debugger;
		this.relationshipTabs = this.relationshipsSettings.tabs;
	}

	discardButtonHandler() {
		this._clearForm();
		this.isSavedResultSuccesOut.emit(true);
		this.editMode = null;
	}

	_clearForm() {
		for (let prop in this.ngModel) {
			this.ngModel[prop] = '';
		};
		this.selectedItem = null;
	}

	_isInputDataInvalid() {
		for (let element of this.controls) {
			if (element.isRequired && !element.idField) {
				if (!this.ngModel[element.field]) {
					return true;
				}
			}
		}
		return false;
	}

	_checkConfirmation() {
		for (let col of this.controls) {
			if (col.confirmOf) {
				const srcCol = col.confirmOf;
				const isEqual = this.ngModel[srcCol] === this.ngModel[col.field];
				if (isEqual) {
					continue;
				} else {
					return srcCol;
				}
			}
		}
	}

	toolbarActionHandler(action) {
		const item = {};//new Iteration();
		if (action === 'save') {
			debugger;
			if (this._isInputDataInvalid()) {
				this.messageService.add({ severity: 'error', summary: 'Error', detail: `Some of required fields are empty.` });
				return;
			}
			debugger;
			const confirmationError = this._checkConfirmation(); 
			if (confirmationError) {
				this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please. check confirmation for ${confirmationError}` });
				return;
			}
			if (this.editMode === 'add') {
				debugger;
				for (let col of this.controls) {
					if (col.confirmOf) {
						continue;
					}
					if (col.type === 'checkbox') {
						item[col.field] = this.ngModel[col['field']] ? 1 : 0;
						continue;	
					}
					if (col.type === 'calendar') {
						item[col.field] = this.dateHelper.getDateFormat(this.ngModel[col['field']]);
						continue;	
					}
					if (col.defaultValue || col.defaultValue === 0 || col.defaultValue === '') {
						item[col.field] = col.defaultValue;
						continue;
					}
					item[col.field] = this.ngModel[col['field']] === undefined ? null : this.ngModel[col['field']] ;
				}
				this.itemService[`insert${this.typeName[0].toUpperCase() + this.typeName.slice(1)}`](item).subscribe((result) => {
					if (result) {
						this.updatedItemOut.emit({
							isNew: true,
							item: item
						});
						this.isSavedResultSuccesOut.emit(true);
						this._clearForm();
						if (this.isPopupMode) {
							//this.popupComponent.destroy();
							//this.isSavedResultSuccesOutInPopupMode.next(true);
						}
					} else {
						this.isSavedResultSuccesOut.emit(false);
						this.messageService.add({ severity: 'error', summary: 'Error', detail: `${this.singularLabel} can not be created.` });
					}
				})
			} else if (this.editMode === 'edit') {
				debugger;
				for (let key in this.selectedItem) {
					if (this.ngModel[key] !== this.selectedItem[key] && key != 'id') {
						debugger;
						const control = this.controls.find(el => el.field === key);
						if (control && control.confirmOf) {
							continue;
						}
						if (control && control.type === 'calendar') {
							item[key] = this.dateHelper.getDateFormat(this.ngModel[key]);
							continue;	
						}
						if (control && control.type === 'checkbox') {
							item[key] = this.ngModel[key] ? 1 : 0;
							continue;	
						}
						item[key] = this.ngModel[key]
					}
				}
				//iteration.start_date = this.dateHelper.getDateFormat(this.start_date);
				//iteration.end_date = this.dateHelper.getDateFormat(this.end_date);
				this.itemService[`update${this.typeName[0].toUpperCase() + this.typeName.slice(1)}`](item, this.selectedItem.id).subscribe((result) => {
					if (result) {
						this.updatedItemOut.emit({
							isNew: false,
							itemID: this.selectedItem.id,
							updatedProps: item
						});
						this.isSavedResultSuccesOut.emit(true);
						this._clearForm();
					} else {
						this.isSavedResultSuccesOut.emit(false);
						this.messageService.add({ severity: 'error', summary: 'Error', detail: `${this.singularLabel} can not be updated.` });
					}
				})
			}
			this.editMode === action;
		}

		if (action === 'add' || action === 'edit') {
			this.editMode = action;
		}
	}

	getRowIndex(control) {
		return control.position && control.position.split('.')[0];
	}

}
