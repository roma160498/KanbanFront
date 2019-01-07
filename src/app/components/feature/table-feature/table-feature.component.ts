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

	amountOfFeatures: number;
	cols: any[];
	features: Feature[];
	loading: boolean;
	scrollHeight: string;
	selectedFeatures: Feature[];
	selectedFeature: Feature;
	rowsAmount: number = 25;
	isTableDisplayed: boolean = true;

	constructor(private featureService: FeatureService, private el: ElementRef, private messageService: MessageService) { }

	ngOnInit() {
		this.featureService.getFeatureCount({}).subscribe(res => {
			debugger;
			this.amountOfFeatures = res[0]['sum'];
		});
		this.cols = [
			{ field: 'name', header: 'Name' },
			{ field: 'description', header: 'Description' },
			{ field: 'acc_criteria', header: 'Acception criteria' },
			{ field: 'creator_name', header: 'Creator' },
			{ field: 'team_name', header: 'Team' },
			{ field: 'type_name', header: 'Classification' },
			{ field: 'product_name', header: 'Product' },
			{ field: 'created_on', header: 'Created' },
			{ field: 'modified_on', header: 'Modified' },
			{ field: 'closed_on', header: 'Closed' }
		];
		this.loading = true;
	}

	_isScrollExist(element): boolean {
		return element.scrollHeight > parseInt(this.scrollHeight);
	}

	onResize(event) {
		/*this.scrollHeight = this.el.nativeElement.getElementsByTagName('p-table')[0].firstElementChild.offsetHeight - 70 + 'px';
		const header: HTMLElement = <HTMLElement>document.getElementsByClassName('ui-table-scrollable-header')[0];
		if (this._isScrollExist(this.el.nativeElement.getElementsByClassName('ui-table-scrollable-body-table')[0])) {
			header.style.marginRight = '17px';
		} else {
			header.style.marginRight = '0px';
		}*/
	}

	rowsAmountChangeHandler(amount, aaa) {
		this.table['__proto__'].reset.call(this.table);
		this.rowsAmount = amount === -1 ? this.amountOfFeatures : amount;
		this.loadFeaturesLazy({
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
				this.selectedFeatures = [];
				this.selectedFeaturesOut.emit(this.selectedFeatures);
				break;
			}
		}
	}

	ngOnChanges(changes: SimpleChange) {

		console.log(changes['updatedFeature'])
		if (changes['updatedFeature']) {
			const feature = changes['updatedFeature'];
			if (feature.currentValue && feature.currentValue.isNew) {
				this.features.push(feature.currentValue.feature);
				this.amountOfFeatures++;
				this.table['__proto__'].reset.call(this.table);
				const name = feature.currentValue.feature.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Feature ${name} created successfully.` });
			}
			if (feature.currentValue && !feature.currentValue.isNew) {
				console.log("UPDSTE")
				const updatedFeature = this.features.find((value, index) => feature.currentValue.featureID == value.id);
				for (let key of Object.keys(feature.currentValue.updatedProps)) {
					updatedFeature[key] = feature.currentValue.updatedProps[key];
				}
				this.table['__proto__'].reset.call(this.table);
				console.log(feature.currentValue)
				const name = feature.currentValue.updatedProps.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Feature ${name} updated successfully.` });
			}
		}
	}

	onSelectUnselectRow(event) {
		console.log(this.selectedFeatures)
		this.selectedFeaturesOut.emit(this.selectedFeatures);
	}

	_refreshGrid(table) {
		this.featureService.getFeatureCount({}).subscribe(res => {
			debugger;
			this.amountOfFeatures = res[0]['sum'];
		});
		this.loading = true;
		this.loadFeaturesLazy({
			first: table.first,
			rows: this.rowsAmount
		});
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
				this.table['__proto__'].reset.call(this.table);
				this.showSuccess(name);
			});
		}
		this.selectedFeatures = [];
		this.selectedFeaturesOut.emit(this.selectedFeatures);
	}

	showSuccess(name) {
		this.messageService.add({ severity: 'success', summary: 'Success', detail: `Feature ${name} deleted successfully.` });
	}

	loadFeaturesLazy(event) {
		debugger;
			this.loading = true;
		this.featureService.getFeature({
			offset: event.first,
			amount: event.rows
		}).subscribe(features => {
			this.features = features;
			this.loading = false;
			this.onResize({});
		});
	}
}
