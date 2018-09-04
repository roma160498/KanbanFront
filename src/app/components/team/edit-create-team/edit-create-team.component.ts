import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Team } from '../../../models/team';
import { MessageService } from 'primeng/components/common/messageservice';
import { TeamService } from '../../../services/team.service';

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
  
  @Output() updatedTeamOut: EventEmitter<any> = new EventEmitter();
	@Output() isSavedResultSuccesOut: EventEmitter<boolean> = new EventEmitter();
  constructor(private teamService: TeamService, private messageService: MessageService) { }

  ngOnInit() {
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
				/*for (let key in this.selectedUser) {
					if (this[key] !== this.selectedUser[key] && key != 'id') {
						user[key] = this[key]
					}
				}
				this.userService.updateUser(user, this.selectedUser.id).subscribe((result)=>{
					if (result) {
						this.updatedUserOut.emit({
							isNew: false,
							userID: this.selectedUser.id,
							updatedProps: user
						});
						this.isSavedResultSuccesOut.emit(true);
						this._clearForm();
					} else {
						this.isSavedResultSuccesOut.emit(false);
						this.messageService.add({ severity: 'error', summary: 'Error', detail: `User with ${this.login} login can not be updated.` });
					}
				})*/
			}
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
	}
}
