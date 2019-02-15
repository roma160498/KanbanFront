import { Component, OnInit, ViewChild } from '@angular/core';
import { TableIssuesComponent } from '../table-issues/table-issues.component';
import { EditCreateIssueComponent } from '../edit-create-issue/edit-create-issue.component';
import { Issue } from '../../../models/issue';

@Component({
	selector: 'app-issue-page',
	templateUrl: './issue-page.component.html',
	styleUrls: ['./issue-page.component.css']
})
export class IssuePageComponent implements OnInit {
	@ViewChild('issueTable') tableComponent: TableIssuesComponent;
	@ViewChild('editComponent') editComponent: EditCreateIssueComponent;
	isTableDisplayed: boolean = true;
	selectedIssues: Issue[];
	updatedIssue: Issue;
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
			const issue = this.selectedIssues[0];
			this.editComponent.name = issue.name;
			this.editComponent.number = issue.number;
			this.editComponent.feature_id = issue.feature_id;
			this.editComponent.featureSelectHandler({value: issue.feature_id});
			this.editComponent.iteration_id = issue.iteration_id;
			this.editComponent.classification_id = issue.classification_id;
			this.editComponent.team_id = issue.team_id;
			this.editComponent.user_id = issue.user_id;
			this.editComponent.story_points = issue.story_points;
			this.editComponent.completeness = issue.completeness;
			this.editComponent.description = issue.description;
			this.editComponent.accCriteria = issue.accCriteria;
			this.editComponent.selectedIssue = issue;
			this.editComponent.teamSelectHandler({value: issue.team_id}, issue.status_id);
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

	selectedIssuesOut(event) {
		this.selectedIssues = event;
		this._updateToolbarButtonsDisabledStates();
	}

	updatedIssueOut(event) {
		this.updatedIssue = event;
	}

	isSavedResultSuccesOut(event) {
		this.isTableDisplayed = event;
		if (event) {
			this._updateToolbarButtonsDisabledStates();
		}
	}

	_updateToolbarButtonsDisabledStates() {
		this.toolbarButtonsDisabledOptions = {
			isDeleteDisabled: !this.userPermissions.issues.get || !this.userPermissions.issues.delete || !(this.selectedIssues && this.selectedIssues.length > 0) || !this.isTableDisplayed,
			isEditDisabled: !(this.selectedIssues && this.selectedIssues.length == 1) || !this.isTableDisplayed,
			isSaveDisabled: (!this.userPermissions.issues.create && !this.userPermissions.issues.update) || (!this.isTableDisplayed && this.editMode && !this.userPermissions.issues.update) || this.isTableDisplayed,
			isRefreshDisabled: !this.userPermissions.issues.get || !this.isTableDisplayed,
			isRowsDownDisabled: !this.userPermissions.issues.get || !this.isTableDisplayed,
			isAddDisabled: !this.userPermissions.issues.get || !this.userPermissions.issues.create || !this.isTableDisplayed,
			isFilterDisabled: !this.isTableDisplayed
		}
	}
}
