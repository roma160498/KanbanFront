import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { RelationshipTableComponent } from '../../global/relationship-table/relationship-table.component';
import { Feature } from '../../../models/feature';
import { MessageService } from 'primeng/components/common/messageservice';
import { FeatureService } from '../../../services/feature.service';
import { SelectItem } from 'primeng/components/common/api';
import { TeamService } from '../../../services/team.service';
import { ProductService } from '../../../services/product.service';
import { IncrementService } from '../../../services/increment.service';
import { SequenceHelperService } from '../../../services/sequence-helper.service';
import { elementAt } from 'rxjs/operator/elementAt';
@Component({
	selector: 'app-edit-create-feature',
	templateUrl: './edit-create-feature.component.html',
	styleUrls: ['./edit-create-feature.component.css']
})
export class EditCreateFeatureComponent implements OnInit {
	selectedFeature: Feature;
	id: number;
	name: string = '';
	number: string = '';
	description: string = '';
	acc_criteria: string = '';
	editMode: string;
	@ViewChild('relationTable') relTableComponent: RelationshipTableComponent;
	@Input() relationshipPermissions: any;

	issueCols: any;
	allRelatedCols: any;
	classificationList: any = {};
	type_id: any;
	teamList: any = {};
	team_id: any;
	productList: any = {};
	product_id: any;
	incrementList: any = {};
	increment_id: any;

	@Output() updatedFeatureOut: EventEmitter<any> = new EventEmitter();
	@Output() isSavedResultSuccesOut: EventEmitter<boolean> = new EventEmitter();
	constructor(private featureService: FeatureService, private messageService: MessageService,
		private teamService: TeamService, private productService: ProductService,
		private incrementService: IncrementService, private sequenceHelper: SequenceHelperService) { }
	ngOnInit() {

		this.allRelatedCols = this.issueCols = [
			{ field: 'number', header: 'Issue number' },
			{ field: 'name', header: 'Issue name' },
			{ field: 'iteration_number', header: 'Iteration number' },
			{ field: 'classification_name', header: 'Classification' },
			{ field: 'status_id', header: 'Status' },
			{ field: 'team_name', header: 'Team' },
			{ field: 'user_fullname', header: 'Assignee' },
			{ field: 'story_points', header: 'Story Points' },
		];

		this.featureService.getFeatureClassification({}).subscribe(items => {
			this.classificationList.options = items.map(el => {
				return {
					label: el.name,
					value: el.id
				}
			});
		});
		this.teamService.getTeam({}).subscribe(items => {
			this.teamList.options = items.map(el => {
				return {
					label: el.name,
					value: el.id
				}
			})
		});
		this.productService.getProduct({}).subscribe(items => {
			this.productList.options = items.map(el => {
				return {
					label: el.name,
					value: el.id
				}
			})
		});
		this.incrementService.getIncrement({}).subscribe(items => {
			this.incrementList.options = items.map(el => {
				return {
					label: `${this.sequenceHelper.getSequenceFor('PI-', 6, el.id)} ${el.name}`,
					value: el.id
				}
			})
		});
	}
	toolbarActionHandler(action) {
		const feature = new Feature();
		debugger;
		if (action === 'save') {
			if (this._isInputDataInvalid()) {
				this.messageService.add({ severity: 'error', summary: 'Error', detail: `Some of required fields are empty.` });
				return;
			}
			if (this.editMode === 'add') {
				feature.name = this.name;
				feature.description = this.description;
				feature.acc_criteria = this.acc_criteria;
				feature.team_id = this.team_id;
				feature.product_id = this.product_id;
				feature.type_id = this.type_id;
				feature.creater_id = localStorage.getItem('id');
				feature.status_id = '1';// MOCK 
				feature.increment_id = this.increment_id;
				this.featureService.insertFeature(feature).subscribe((result) => {
					if (result) {
						this.updatedFeatureOut.emit({
							isNew: true,
							feature: feature
						});
						this.isSavedResultSuccesOut.emit(true);
						this._clearForm();
					} else {
						this.isSavedResultSuccesOut.emit(false);
						this.messageService.add({ severity: 'error', summary: 'Error', detail: `Feature with ${this.name} name can not be created.` });
					}
				})
			} else if (this.editMode === 'edit') {
				for (let key in this.selectedFeature) {
					if (this[key] !== this.selectedFeature[key] && key != 'id') {
						feature[key] = this[key]
					}
				}
				this.featureService.updateFeature(feature, this.selectedFeature.id).subscribe((result)=>{
					if (result) {
						this.updatedFeatureOut.emit({
							isNew: false,
							featureID: this.selectedFeature.id,
							updatedProps: feature
						});
						this.isSavedResultSuccesOut.emit(true);
						this._clearForm();
					} else {
						this.isSavedResultSuccesOut.emit(false);
						this.messageService.add({ severity: 'error', summary: 'Error', detail: `Feature with ${this.name} name can not be updated.` });
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
		return this.name === '' || !this.type_id || !this.product_id ;
	}

	_clearForm() {
		this.number = '';
		this.name = '';
		this.description = '';
		this.acc_criteria = '';
		this.number = '';
		this.type_id = '';
		this.product_id = '';
		this.team_id = '';
		this.increment_id = '';
		this.selectedFeature = null;
	}

	discard() {
		this._clearForm();
		this.isSavedResultSuccesOut.emit(true);
		this.editMode = null;
	}

	splitterMove(event) {
		console.log(event)
	}
}
