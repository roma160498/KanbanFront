import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Team } from '../../../models/team';
import { MessageService } from 'primeng/components/common/messageservice';
import { TeamService } from '../../../services/team.service';
import { UserService } from '../../../services/user.service';
import { RelationshipTableComponent } from '../../global/relationship-table/relationship-table.component';

@Component({
  selector: 'app-edit-create-team',
  templateUrl: './edit-create-team.component.html',
  styleUrls: ['./edit-create-team.component.css'],
	providers: [MessageService]
})
export class EditCreateTeamComponent implements OnInit {
  selectedTeam: Team;
	id: number;
	name: string = '';
	selectedTeams: Team[];
	editMode: string;
	@ViewChild('relationTable') relTableComponent: RelationshipTableComponent;
  
  userCols: any;
  
  @Output() updatedTeamOut: EventEmitter<any> = new EventEmitter();
	@Output() isSavedResultSuccesOut: EventEmitter<boolean> = new EventEmitter();
  constructor(private teamService: TeamService, private messageService: MessageService, private userService: UserService) { }

  ngOnInit() {
	this.userCols = [
		{ field: 'name', header: 'Name' },
		{ field: 'surname', header: 'Surname' },
		{ field: 'login', header: 'Login' },
		{ field: 'email', header: 'Email' }
	];
  }
  toolbarActionHandler(action) {
		const team = new Team();
		if (action === 'save') {
			if (this._isInputDataInvalid()) {
				this.messageService.add({ severity: 'error', summary: 'Error', detail: `Some of required fields are empty.` });
				return;
			}
			if (this.editMode === 'add') {
				team.name = this.name;
				this.teamService.insertTeam(team).subscribe((result) => {
					if (result) {
						this.updatedTeamOut.emit({
							isNew: true,
							team: team 
						});
						this.isSavedResultSuccesOut.emit(true);
						this._clearForm();
					} else {
						this.isSavedResultSuccesOut.emit(false);
						this.messageService.add({ severity: 'error', summary: 'Error', detail: `Team with ${this.name} name can not be created.` });
					}
				})
			} else if (this.editMode === 'edit') {

				for (let key in this.selectedTeam) {
					if (this[key] !== this.selectedTeam[key] && key != 'id') {
						team[key] = this[key]
					}
				}
				this.teamService.updateTeam(team, this.selectedTeam.id).subscribe((result)=>{
					if (result) {
						this.updatedTeamOut.emit({
							isNew: false,
							teamID: this.selectedTeam.id,
							updatedProps: team
						});
						this.isSavedResultSuccesOut.emit(true);
						this._clearForm();
					} else {
						this.isSavedResultSuccesOut.emit(false);
						this.messageService.add({ severity: 'error', summary: 'Error', detail: `Team with ${this.name} name can not be updated.` });
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
		return this.name === '';
	}

  _clearForm() {
		this.name = '';
  }
  
  discard() {
		this._clearForm();
		this.isSavedResultSuccesOut.emit(true);
		this.editMode = null;
	}
}
