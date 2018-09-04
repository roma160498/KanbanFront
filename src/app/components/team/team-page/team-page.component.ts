import { Component, OnInit, ViewChild } from '@angular/core';
import { TableTeamsComponent } from '../../team/table-teams/table-teams.component';
import { Team } from '../../../models/team';
import { EditCreateTeamComponent } from '../edit-create-team/edit-create-team.component';

@Component({
	selector: 'app-team-page',
	templateUrl: './team-page.component.html',
	styleUrls: ['./team-page.component.css']
})
export class TeamPageComponent implements OnInit {
	@ViewChild('teamTable') tableComponent: TableTeamsComponent;
	@ViewChild('editComponent') editComponent: EditCreateTeamComponent;
	isTableDisplayed: boolean = true;
	selectedTeams: Team[];
	updatedTeam: Team;
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
			const team = this.selectedTeams[0];
			this.editComponent.name = team.name;
			this.editComponent.selectedTeam = team;
		}
		this.isTableDisplayed = event === 'add' || event === 'edit' || event === 'save' ? false : true;
		this._updateToolbarButtonsDisabledStates();
		this.tableComponent.toolbarActionHandler(event, {});
		this.editComponent.toolbarActionHandler(event, );
	}

	rowsAmountChangeHandler(event) {
		this.tableComponent.rowsAmountChangeHandler(event, {});
	}

	selectedTeamsOut(event) {
		this.selectedTeams = event;
		this._updateToolbarButtonsDisabledStates();
	}

	updatedTeamOut(event) {
		this.updatedTeam = event;
	}

	isSavedResultSuccesOut(event) {
		this.isTableDisplayed = event;
		if (event) {
			this._updateToolbarButtonsDisabledStates();
		}
	}

	_updateToolbarButtonsDisabledStates() {
		this.toolbarButtonsDisabledOptions = {
			isDeleteDisabled: !(this.selectedTeams && this.selectedTeams.length > 0) || !this.isTableDisplayed,
			isEditDisabled: !(this.selectedTeams && this.selectedTeams.length == 1) || !this.isTableDisplayed,
			isSaveDisabled: this.isTableDisplayed,
			isRefreshDisabled: !this.isTableDisplayed,
			isRowsDownDisabled: !this.isTableDisplayed,
			isAddDisabled: !this.isTableDisplayed
		}
	}
}
