import { Component, OnInit, ViewChild, EventEmitter, Output, Input, ViewContainerRef } from '@angular/core';
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
import { ComponentLoaderService } from '../../../services/component-loader.service';
import { EditCreateIssueComponent } from '../../issue/edit-create-issue/edit-create-issue.component';
import { DateHelperService } from '../../../services/date-helper.service';
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
	closed_on: string = '';
	created_on: string = '';
	modified_on: string = '';
	@ViewChild('relationTable') relTableComponent: RelationshipTableComponent;
	@Input() relationshipPermissions: any;

	issueCols: any;
	allRelatedCols: any;
	classificationList: any = {};
	type_id: any;
	teamList: any = {};
	team_id: any = null;
	productList: any = {};
	product_id: any;
	incrementList: any = {};
	increment_id: any;
	statusList: any = {};
	status_id: any = null;
	issueFormComponent: any;
	isIssueFormVisible: boolean = false;
	featureActionIcon: string = 'pi pi-lock';
	featureActionLabel: string = 'Close feature';
	isClosed: boolean = false;
	ub_value: number = null;
	time_crit: number = null;
	risk_red: number = null;
	job_size: number = null;
	wsjf: number = null;

	@Output() updatedFeatureOut: EventEmitter<any> = new EventEmitter();
	@Output() isSavedResultSuccesOut: EventEmitter<boolean> = new EventEmitter();
	@ViewChild('newIssueForm', { read: ViewContainerRef }) entry: ViewContainerRef;
	constructor(private featureService: FeatureService, private messageService: MessageService,
		private teamService: TeamService, private productService: ProductService,
		private incrementService: IncrementService, private sequenceHelper: SequenceHelperService,
		private componentLoaderService: ComponentLoaderService,
		private dateHelper: DateHelperService) { }
	ngOnInit() {
		this.allRelatedCols = this.issueCols = [
			{ field: 'number', header: 'Issue number' },
			{ field: 'name', header: 'Issue name' },
			{ field: 'iteration_number', header: 'Iteration number' },
			{ field: 'classification_name', header: 'Classification' },
			{ field: 'status_name', header: 'Status' },
			{ field: 'team_name', header: 'Team' },
			{ field: 'user_fullname', header: 'Assignee' },
			{ field: 'story_points', header: 'Story Points' },
			{ field: 'isClosed', header: 'Closed' }
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
		this.featureService.getFeatureStates().subscribe(items => {
			this.statusList.options = items.map(el => {
				return {
					label: `${el.name}`,
					value: el.id
				}
			});
			this.status_id = 1;
		});
	}
	toolbarActionHandler(action) {
		const feature = new Feature();
		debugger;
		if (action === 'save') {
			if (this.isClosed) {
				this.messageService.add({ severity: 'error', summary: 'Error', detail: `Feature is closed. You can't edit closed features.` });
				return;
			}
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
				feature.job_size = this.job_size;
				feature.risk_red = this.risk_red;
				feature.time_crit = this.time_crit;
				feature.ub_value = this.ub_value;
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
				debugger;
				for (let key in this.selectedFeature) {
					if (this[key] !== this.selectedFeature[key] && key != 'id' && key != 'isClosed') {
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
		this.status_id = 1;
		this.ub_value = null;
		this.time_crit = null;
		this.risk_red = null;
		this.job_size = null;
		this.wsjf = null;
	}

	discard() {
		this._clearForm();
		this.isSavedResultSuccesOut.emit(true);
		this.editMode = null;
	}

	splitterMove(event) {
		console.log(event)
	}

	createNewIssue() {
		this.isIssueFormVisible = true;
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		this.issueFormComponent = this.componentLoaderService.addComponent(EditCreateIssueComponent);
		// this.issueFormComponent.instance.increment_id = this.selectedIncrement.id;
debugger;
		this.issueFormComponent.instance.feature_id = this.selectedFeature.id;
		this.issueFormComponent.instance.featureSelectHandler({});
		this.issueFormComponent.instance.isPopupMode = true;
		this.issueFormComponent.instance.completeness = 0;
		this.issueFormComponent.instance.popupComponent = this.issueFormComponent;
		this.issueFormComponent.instance.isSavedResultSuccesOutInPopupMode.subscribe((() => {
			this.isIssueFormVisible = false;
		}).bind(this));
	}

	closeFeature() {
		const feature = new Feature()
		if (!this.isClosed) {
			const time = new Date();;
			feature.closed_on = this.dateHelper.getDateFormat(time) + ' ' + this.dateHelper.getTimeFormat(time);
		} else {
			feature.closed_on = null;
		}
		this.selectedFeature.isClosed = this.isClosed;
		this.featureService.updateFeature(feature, this.selectedFeature.id).subscribe((result) => {
			if (result) {
				debugger;
				this.closed_on = this.selectedFeature.closed_on = feature.closed_on;
				this.updateFeatureActionButton();
				if (this.isClosed) {
					this.messageService.add({ severity: 'success', summary: 'Success', detail: `Feature closed successfully.` });
				} else {
					this.messageService.add({ severity: 'success', summary: 'Success', detail: `Feature reopened successfully.` });
				}
			}
		});
	}

	updateFeatureActionButton() {
		if (this.selectedFeature.closed_on) {
			this.isClosed = true;
			this.featureActionIcon = 'pi pi-unlock';
			this.featureActionLabel = 'Reopen feature';
		} else {
			this.isClosed = false;
			this.featureActionIcon = 'pi pi-lock';
			this.featureActionLabel = 'Close feature';
		}
	}
}
