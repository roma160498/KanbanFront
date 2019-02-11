import { Component, OnInit, ViewChild, Output, Input, EventEmitter, ElementRef, SimpleChange } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { TableModule } from 'primeng/table';
import { Feature } from '../../../models/feature';
import { FeatureService } from '../../../services/feature.service';

@Component({
	selector: 'app-table-feature',
	templateUrl: './table-feature.component.html',
	styleUrls: ['./table-feature.component.css']
})
export class TableFeatureComponent implements OnInit {

	@ViewChild('table') table: TableModule;
	@Output() selectedFeaturesOut: EventEmitter<Feature[]> = new EventEmitter();
	@Input() updatedFeature: any;
	@Input() canGet: boolean;

	amountOfFeatures: number;
	cols: any[];
	features: Feature[] = [];
	scrollHeight: string;
	selectedFeatures: Feature[];
	selectedFeature: Feature;
	rowsAmount: number = 25;
	isTableDisplayed: boolean = true;
	searchIsVisible: boolean = true;

	constructor(private featureService: FeatureService, private el: ElementRef, private messageService: MessageService) { }

	ngOnInit() {
		this.cols = [
			{ field: 'number', header: 'Feature Number' },
			{ field: 'name', header: 'Name' },
			{ field: 'increment_number', header: 'Program Increment' },
			{ field: 'creator_name', header: 'Creator' },
			{ field: 'team_name', header: 'Team' },
			{ field: 'type_name', header: 'Classification' },
			{ field: 'product_name', header: 'Product' },
			{ field: 'created_on', header: 'Created' },
			{ field: 'modified_on', header: 'Modified' },
			{ field: 'closed_on', header: 'Closed' }
		];
		this.getFeatures();
	}

	getFeatures() {
		if (this.canGet) {
			this.featureService.getFeature({}).subscribe(features => {
				this.amountOfFeatures = features.length;
				this.features = features;
			});
		}
	}

	_isScrollExist(element): boolean {
		return element.scrollHeight > parseInt(this.scrollHeight);
	}

	rowsAmountChangeHandler(amount, aaa) {
		this.resetTable();
		this.rowsAmount = amount === -1 ? this.amountOfFeatures : amount;
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
				this.selectedFeatures = [];
				this.selectedFeaturesOut.emit(this.selectedFeatures);
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
		if (changes['updatedFeature']) {
			const feature = changes['updatedFeature'];
			if (feature.currentValue && feature.currentValue.isNew) {
				this.features.push(feature.currentValue.feature);
				this.amountOfFeatures++;
				this.resetTable();
				const name = feature.currentValue.feature.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Feature ${name} created successfully.` });
			}
			if (feature.currentValue && !feature.currentValue.isNew) {
				debugger;
				const updatedFeature = this.features.find((value, index) => feature.currentValue.featureID == value.id);
				for (let key of Object.keys(feature.currentValue.updatedProps)) {
					if (feature.currentValue.updatedProps[key] !== undefined) {
						updatedFeature[key] = feature.currentValue.updatedProps[key];
					}
				}
				this.resetTable();
				const name = feature.currentValue.updatedProps.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Feature ${name} updated successfully.` });
			}
		}
	}

	onSelectUnselectRow(event) {
		this.selectedFeaturesOut.emit(this.selectedFeatures);
	}

	_refreshGrid(table) {
		this.getFeatures();
		this.clearFilterInputs();
	}

	_deleteItem(table) {
		for (let i = 0; i < this.selectedFeatures.length; i++) {
			const arrayIndex = this.features.indexOf(this.selectedFeatures[i]);
			this.features = this.features.filter((value, index) => arrayIndex != index);
			const selectedId = this.selectedFeatures[i].id;
			this.amountOfFeatures--;
			this.selectedFeatures
			const name = this.selectedFeatures[i].name;
			this.featureService.deleteFeature({ id: selectedId }).subscribe(res => {
				this.resetTable();
				this.showSuccess(name);
			});
		}
		this.selectedFeatures = [];
		this.selectedFeaturesOut.emit(this.selectedFeatures);
	}

	showSuccess(name) {
		this.messageService.add({ severity: 'success', summary: 'Success', detail: `Feature ${name} deleted successfully.` });
	}

	resetTable() {
		this.table['__proto__'].reset.call(this.table);
		//this.clearFilterInputs();
	}

	clearFilterInputs() {
		const filters = document.getElementsByClassName('filterInput');
		for (let i = 0; i < filters.length; i++) {
			(<HTMLInputElement>filters[i]).value = '';
			this.table['__proto__'].filter.call(this.table, '', this.cols[i].field);
		}
	}
}
