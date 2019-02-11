import { Component, OnInit, ViewChild } from '@angular/core';
import { TableIncrementComponent } from '../table-increment/table-increment.component';
import { EditCreateIncrementComponent } from '../edit-create-increment/edit-create-increment.component';
import { Increment } from '../../../models/increment';

@Component({
	selector: 'app-increment-page',
	templateUrl: './increment-page.component.html',
	styleUrls: ['./increment-page.component.css']
})
export class IncrementPageComponent implements OnInit {
	@ViewChild('incrementTable') tableComponent: TableIncrementComponent;
	@ViewChild('editComponent') editComponent: EditCreateIncrementComponent;
	isTableDisplayed: boolean = true;
	selectedIncrements: Increment[];
	updatedIncrement: Increment;
	lastToolbarAction: string;
	toolbarButtonsDisabledOptions: any = {
		isDeleteDisabled: true,
		isEditDisabled: true,
		isSaveDisabled: true,
		isRefreshDisabled: false,
		isRowsDownDisabled: false,
		isAddDisabled: false
	};
	editMode: boolean = false;

	userPermissions: any = {};

	constructor() {
	}

	ngOnInit() {
		this.userPermissions = JSON.parse(localStorage.getItem('permissions'));
		this._updateToolbarButtonsDisabledStates();
	}

	toolbarActionHandler(event) {
		if (event === 'edit') {
			const increment = this.selectedIncrements[0];
			this.editComponent.name = increment.name;
			this.editComponent.business_objectives = increment.business_objectives;
			this.editComponent.product_id = increment.product_id;
			this.editComponent.number = increment.number;
			this.editComponent.start_date = new Date(increment.start_date);
			this.editComponent.end_date = new Date(increment.end_date);
			this.editComponent.selectedIncrement = increment;
			this.editMode = true;
		} else {
			this.editMode = false;
		}
		this.isTableDisplayed = event === 'add' || event === 'edit' || event === 'save' ? false : true;
		this._updateToolbarButtonsDisabledStates();
		this.tableComponent.toolbarActionHandler(event, {});
		this.editComponent.toolbarActionHandler(event, );
	}

	rowsAmountChangeHandler(event) {
		this.tableComponent.rowsAmountChangeHandler(event, {});
	}

	selectedIncrementsOut(event) {
		this.selectedIncrements = event;
		this._updateToolbarButtonsDisabledStates();
	}

	updatedIncrementOut(event) {
		this.updatedIncrement = event;
	}

	isSavedResultSuccesOut(event) {
		this.isTableDisplayed = event;
		if (event) {
			this._updateToolbarButtonsDisabledStates();
		}
	}

	_updateToolbarButtonsDisabledStates() {
		this.toolbarButtonsDisabledOptions = {
			isDeleteDisabled: !this.userPermissions['program increments'].get || !this.userPermissions['program increments'].delete || !(this.selectedIncrements && this.selectedIncrements.length > 0) || !this.isTableDisplayed,
			isEditDisabled: !(this.selectedIncrements && this.selectedIncrements.length == 1) || !this.isTableDisplayed,
			isSaveDisabled: (!this.userPermissions['program increments'].create && !this.userPermissions['program increments'].update) || (!this.isTableDisplayed && this.editMode && !this.userPermissions['program increments'].update) || this.isTableDisplayed,
			isRefreshDisabled: !this.userPermissions['program increments'].get || !this.isTableDisplayed,
			isRowsDownDisabled: !this.userPermissions['program increments'].get || !this.isTableDisplayed,
			isAddDisabled: !this.userPermissions['program increments'].get || !this.userPermissions['program increments'].create || !this.isTableDisplayed,
			isFilterDisabled: !this.isTableDisplayed
		}
	}
}
