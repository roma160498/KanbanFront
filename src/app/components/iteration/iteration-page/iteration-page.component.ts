import { Component, OnInit, ViewChild } from '@angular/core';
import { TableIterationsComponent } from '../table-iterations/table-iterations.component';
import { EditCreateIterationComponent } from '../edit-create-iteration/edit-create-iteration.component';
import { Iteration } from '../../../models/iteration';

@Component({
  selector: 'app-iteration-page',
  templateUrl: './iteration-page.component.html',
  styleUrls: ['./iteration-page.component.css']
})
export class IterationPageComponent implements OnInit {
  @ViewChild('iterationTable') tableComponent: TableIterationsComponent;
	@ViewChild('editComponent') editComponent: EditCreateIterationComponent;
	isTableDisplayed: boolean = true;
	selectedIterations: Iteration[];
	updatedIteration: Iteration;
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
			const iteration = this.selectedIterations[0];
      this.editComponent.name = iteration.name;
      this.editComponent.increment_id = iteration.increment_id;
      this.editComponent.completeness = iteration.completeness;
      this.editComponent.story_points = iteration.story_points;
			this.editComponent.number = iteration.number;
			this.editComponent.start_date = new Date(iteration.start_date);
			this.editComponent.end_date = new Date(iteration.end_date);
      this.editComponent.selectedIteration = iteration;
      this.editComponent.isCalendarDisabled = false;
      this.editComponent.completePercent = Math.round(iteration.completeness !== 0 ? iteration.completeness / iteration.story_points * 100 : 0);
    }
    if (event === 'add') {
      this.editComponent.completeness = 0;
      this.editComponent.story_points = 0;
    }
		this.isTableDisplayed = event === 'add' || event === 'edit' || event === 'save' ? false : true;
		this._updateToolbarButtonsDisabledStates();
		this.tableComponent.toolbarActionHandler(event, {});
		this.editComponent.toolbarActionHandler(event, );
	}

	rowsAmountChangeHandler(event) {
		this.tableComponent.rowsAmountChangeHandler(event, {});
	}

	selectedIterationsOut(event) {
		this.selectedIterations = event;
		this._updateToolbarButtonsDisabledStates();
	}

	updatedIterationOut(event) {
		this.updatedIteration = event;
	}

	isSavedResultSuccesOut(event) {
		this.isTableDisplayed = event;
		if (event) {
			this._updateToolbarButtonsDisabledStates();
		}
	}

	_updateToolbarButtonsDisabledStates() {
		this.toolbarButtonsDisabledOptions = {
			isDeleteDisabled: !(this.selectedIterations && this.selectedIterations.length > 0) || !this.isTableDisplayed,
			isEditDisabled: !(this.selectedIterations && this.selectedIterations.length == 1) || !this.isTableDisplayed,
			isSaveDisabled: this.isTableDisplayed,
			isRefreshDisabled: !this.isTableDisplayed,
			isRowsDownDisabled: !this.isTableDisplayed,
			isAddDisabled: !this.isTableDisplayed,
			isFilterDisabled: !this.isTableDisplayed
		}
	}
}
