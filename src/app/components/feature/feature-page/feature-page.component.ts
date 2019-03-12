import { Component, OnInit, ViewChild } from '@angular/core';
import { TableFeatureComponent } from '../table-feature/table-feature.component';
import { Feature } from '../../../models/feature';
import { EditCreateFeatureComponent } from '../edit-create-feature/edit-create-feature.component';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-feature-page',
  templateUrl: './feature-page.component.html',
  styleUrls: ['./feature-page.component.css'],
  providers: [MessageService]
})
export class FeaturePageComponent implements OnInit {
  @ViewChild('featureTable') tableComponent: TableFeatureComponent;
	@ViewChild('editComponent') editComponent: EditCreateFeatureComponent;
	isTableDisplayed: boolean = true;
	selectedFeatures: Feature[];
	updatedFeature: Feature;
	lastToolbarAction: string;
	toolbarButtonsDisabledOptions: any = {
		isDeleteDisabled: true,
		isEditDisabled: true,
		isSaveDisabled: true,
		isRefreshDisabled: false,
		isRowsDownDisabled: false,
		isAddDisabled: false
	};
	kanbanOneColumns: any[] =
    [
        { text: 'Backlog', dataField: 'new', maxItems: 10 }
    ];
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
			const feature = this.selectedFeatures[0];
        	this.editComponent.name = feature.name;
			this.editComponent.description = feature.description;
			this.editComponent.acc_criteria = feature.acc_criteria;
			this.editComponent.product_id = feature.product_id;
			this.editComponent.team_id = feature.team_id;
			this.editComponent.type_id = feature.type_id;
			this.editComponent.number = feature.number;
			this.editComponent.increment_id = feature.increment_id;
			this.editComponent.status_id = feature.status_id;
			this.editComponent.closed_on = feature.closed_on;
			this.editComponent.created_on = feature.created_on;
			this.editComponent.modified_on = feature.modified_on;
			this.editComponent.ub_value = feature.ub_value;
			this.editComponent.time_crit = feature.time_crit;
			this.editComponent.risk_red = feature.risk_red;
			this.editComponent.job_size = feature.job_size;
			this.editComponent.wsjf = feature.wsjf;
			this.editComponent.selectedFeature = feature;
			this.editComponent.updateFeatureActionButton();
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

	selectedFeaturesOut(event) {
		this.selectedFeatures = event;
		this._updateToolbarButtonsDisabledStates();
	}

	updatedFeatureOut(event) {
		this.updatedFeature = event;
	}

	isSavedResultSuccesOut(event) {
		this.isTableDisplayed = event;
		if (event) {
			this._updateToolbarButtonsDisabledStates();
		}
	}

	_updateToolbarButtonsDisabledStates() {
		this.toolbarButtonsDisabledOptions = {
			isDeleteDisabled:  !this.userPermissions.features.get || !this.userPermissions.features.delete || !(this.selectedFeatures && this.selectedFeatures.length > 0) || !this.isTableDisplayed,
			isEditDisabled: !(this.selectedFeatures && this.selectedFeatures.length == 1) || !this.isTableDisplayed,
			isSaveDisabled: (!this.userPermissions.features.create && !this.userPermissions.features.update) || (!this.isTableDisplayed && this.editMode && !this.userPermissions.features.update) || this.isTableDisplayed,
			isRefreshDisabled: !this.userPermissions.features.get || !this.isTableDisplayed,
			isRowsDownDisabled: !this.userPermissions.features.get || !this.isTableDisplayed,
			isAddDisabled: !this.userPermissions.features.get || !this.userPermissions.features.create || !this.isTableDisplayed,
			isFilterDisabled: !this.isTableDisplayed
		}
	}
}
