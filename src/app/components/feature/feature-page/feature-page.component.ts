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

	constructor() {
	 }

	ngOnInit() {
	}

	toolbarActionHandler(event) {
		if (event === 'edit') {
			const feature = this.selectedFeatures[0];
   //   this.editComponent.name = feature.name;
   //   this.editComponent.description = feature.description;
		//	this.editComponent.selectedFeature = feature;
		}
		this.isTableDisplayed = event === 'add' || event === 'edit' || event === 'save' ? false : true;
		this._updateToolbarButtonsDisabledStates();
	//	this.tableComponent.toolbarActionHandler(event, {});
	//	this.editComponent.toolbarActionHandler(event, );
	}

	rowsAmountChangeHandler(event) {
	//	this.tableComponent.rowsAmountChangeHandler(event, {});
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
			isDeleteDisabled: !(this.selectedFeatures && this.selectedFeatures.length > 0) || !this.isTableDisplayed,
			isEditDisabled: !(this.selectedFeatures && this.selectedFeatures.length == 1) || !this.isTableDisplayed,
			isSaveDisabled: this.isTableDisplayed,
			isRefreshDisabled: !this.isTableDisplayed,
			isRowsDownDisabled: !this.isTableDisplayed,
			isAddDisabled: !this.isTableDisplayed
		}
	}
}
