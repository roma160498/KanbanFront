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

	constructor() {
	}

	ngOnInit() {
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
			isDeleteDisabled: !(this.selectedIncrements && this.selectedIncrements.length > 0) || !this.isTableDisplayed,
			isEditDisabled: !(this.selectedIncrements && this.selectedIncrements.length == 1) || !this.isTableDisplayed,
			isSaveDisabled: this.isTableDisplayed,
			isRefreshDisabled: !this.isTableDisplayed,
			isRowsDownDisabled: !this.isTableDisplayed,
			isAddDisabled: !this.isTableDisplayed
		}
	}
}
