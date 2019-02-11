import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { Issue } from '../../../models/issue';
import { RelationshipTableComponent } from '../../global/relationship-table/relationship-table.component';
import { IssueService } from '../../../services/issue.service';
import { DateHelperService } from '../../../services/date-helper.service';
import { ProductService } from '../../../services/product.service';
import { TeamService } from '../../../services/team.service';
import { UserService } from '../../../services/user.service';
import { FeatureService } from '../../../services/feature.service';
import { SequenceHelperService } from '../../../services/sequence-helper.service';
import { IncrementService } from '../../../services/increment.service';

@Component({
	selector: 'app-edit-create-issue',
	templateUrl: './edit-create-issue.component.html',
	styleUrls: ['./edit-create-issue.component.css'],
	providers: [MessageService]
})
export class EditCreateIssueComponent implements OnInit {
	selectedIssue: Issue;
	id: number;
	name: string = '';
	number: string = '';
	start_date: Date;
	end_date: Date;
	story_points: number = null;;
	completeness: number = null;;
	accCriteria: string = '';
	description: string = '';
	selectedIssues: Issue[];
	editMode: string;
	@ViewChild('relationTable') relTableComponent: RelationshipTableComponent;
	@Input() relationshipPermissions: any;

	teamList: any = {};
	team_id: any = null;
	userList: any = {};
	user_id: any = null;
	featureList: any = {};
	feature_id: any = null;
	iterationList: any = {};
	iteration_id: any = null;
	classificationList: any = {};
	classification_id: any = null;


	minDate: Date;
	maxDate: Date;
	isCalendarDisabled: Boolean = true;
	completePercent: number = 0;
	isPopupMode: Boolean = false;
	popupComponent: any;
	//@Output() isSavedResultSuccesOutInPopupMode: Subject<boolean> = new Subject();
	completenessList: any = {
		options: [{
			label: "0%",
			value: 0
		},{
			label: "5%",
			value: 5
		}, {
			label: "25%",
			value: 25
		},
		{
			label: "30%",
			value: 30
		},
		{
			label: "50%",
			value: 50
		},
		{
			label: "75%",
			value: 75
		},
		{
			label: "90%",
			value: 90
		},
		{
			label: "100%",
			value: 100
		}]
	};

	@Output() updatedIssueOut: EventEmitter<any> = new EventEmitter();
	@Output() isSavedResultSuccesOut: EventEmitter<boolean> = new EventEmitter();
	constructor(private issueService: IssueService, private messageService: MessageService,
		private dateHelper: DateHelperService, private teamService: TeamService,
		private userService: UserService, private featureService: FeatureService,
		private sequenceHelper: SequenceHelperService, private incrementService: IncrementService) { }
	ngOnInit() {
		this.teamService.getTeam({}).subscribe(items => {
			this.teamList.options = items.map(el => {
			  return {
				label: el.name,
				value: el.id
			  }
			})
		});
		this.userService.getUser({}).subscribe(items => {
			this.userList.options = items.map(el => {
			  return {
				label: `${el.name} ${el.surname}` ,
				value: el.id
			  }
			})
		});
		this.featureService.getFeature({}).subscribe(items => {
			this.featureList.list = items;
			this.featureList.options = items.map(el => {
			  return {
				label: `${this.sequenceHelper.getSequenceFor('F-', 6, el.id)} ${el.name}` ,
				value: el.id
			  }
			})
		});
		this.issueService.getIssueClassification({}).subscribe(items => {
			this.classificationList.options = items.map(el => {
			  return {
				label: `${el.name}` ,
				value: el.id
			  }
			})
		});
	}
	toolbarActionHandler(action) {
		debugger;
		const issue = new Issue();
		if (action === 'save') {
			if (this._isInputDataInvalid()) {
				this.messageService.add({ severity: 'error', summary: 'Error', detail: `Some of required fields are empty.` });
				return;
			}
			if (this.editMode === 'add') {
				issue.name = this.name;
				issue.status_id = 0; // MOCK
				issue.feature_id = this.feature_id;
				issue.iteration_id = this.iteration_id;
				issue.classification_id = this.classification_id;
				issue.team_id = this.team_id;
				issue.user_id = this.user_id;
				issue.story_points = this.story_points;
				issue.completeness = this.completeness;
				issue.name = this.name;
				issue.description = this.description;
				issue.accCriteria = this.accCriteria;

				this.issueService.insertIssue(issue).subscribe((result) => {
						if (result) {
							this.updatedIssueOut.emit({
								isNew: true,
								issue: issue
							});
							this.isSavedResultSuccesOut.emit(true);
							this._clearForm();
							if (this.isPopupMode) {
								this.popupComponent.destroy();
								//this.isSavedResultSuccesOutInPopupMode.next(true);
							}
						} else {
							this.isSavedResultSuccesOut.emit(false);
							this.messageService.add({ severity: 'error', summary: 'Error', detail: `Issue with ${this.name} name can not be created.` });
						}
					});
			} else if (this.editMode === 'edit') {

				for (let key in this.selectedIssue) {
					if (this[key] !== this.selectedIssue[key] && key != 'id') {
						issue[key] = this[key]
					}
				}
				this.issueService.updateIssue(issue, this.selectedIssue.id).subscribe((result) => {
					if (result) {
						this.updatedIssueOut.emit({
							isNew: false,
							issueID: this.selectedIssue.id,
							updatedProps: issue
						});
						this.isSavedResultSuccesOut.emit(true);
						this._clearForm();
					} else {
						this.isSavedResultSuccesOut.emit(false);
						this.messageService.add({ severity: 'error', summary: 'Error', detail: `Issue with ${this.name} name can not be updated.` });
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
		return this.name === '' || !this.feature_id || !this.classification_id;
	}

	_clearForm() {
		this.number = '';
		this.name = '';
		this.feature_id = null;
		this.iteration_id = null;
		this.classification_id = null;
		this.team_id = null;
		this.user_id = null;
		this.story_points = null;
		this.completeness = null;
		this.description = '';
		this.accCriteria = '';
		this.selectedIssue = null;
	}

	saveItself() {
		this.editMode = 'add';
		this.toolbarActionHandler('save');
	}
	discard() {
		if (this.isPopupMode) {
			//	this.isSavedResultSuccesOutInPopupMode.next(false);
			this.popupComponent.destroy();
		} else {
			this._clearForm();
			this.isSavedResultSuccesOut.emit(true);
			this.editMode = null;
		}
	}

	featureSelectHandler(event) {
		let availableIncrementId;
		for (let i = 0; i < this.featureList.list.length; i++) {
			if (this.featureList.list[i].id === event.value) {
				availableIncrementId = this.featureList.list[i].increment_id;
				break;
			}
		}
		this.incrementService.getIterationsOfIncrement({}, availableIncrementId).subscribe(items => {
			this.iterationList.options = items.map(el => {
			  return {
				label: `${this.sequenceHelper.getSequenceFor('IT-', 6, el.id)} ${el.name}` ,
				value: el.id
			  }
			})
		});
		
	}
}
