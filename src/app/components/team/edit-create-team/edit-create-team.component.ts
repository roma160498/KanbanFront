import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { Team } from '../../../models/team';
import { MessageService } from 'primeng/components/common/messageservice';
import { TeamService } from '../../../services/team.service';
import { UserService } from '../../../services/user.service';
import { RelationshipTableComponent } from '../../global/relationship-table/relationship-table.component';
import { RoleService } from '../../../services/role.service';
import {trigger,state,style,transition,animate,AnimationEvent} from '@angular/animations';
@Component({
	selector: 'app-edit-create-team',
	templateUrl: './edit-create-team.component.html',
	styleUrls: ['./edit-create-team.component.css'],
	providers: [MessageService],
	animations: [
        trigger('animation', [
            state('visible', style({
                transform: 'translateX(0)',
                opacity: 1
            })),
            transition('void => *', [
                style({transform: 'translateX(50%)', opacity: 0}),
                animate('300ms ease-out')
            ]),
            transition('* => void', [
                animate(('250ms ease-in'), style({
                    height: 0,
                    opacity: 0,
                    transform: 'translateX(50%)'
                }))
            ])
		])
	]
})
export class EditCreateTeamComponent implements OnInit {
	selectedTeam: Team;
	id: number;
	name: string = '';
	selectedTeams: Team[];
	editMode: string;
	@ViewChild('relationTable') relTableComponent: RelationshipTableComponent;
	@Input() relationshipPermissions: any;
	@Output() selectedRelatedItemToOpen: EventEmitter<any> = new EventEmitter();

	userCols: any;
	issueCols: any;
	issueAllRelatedCols: any;
	userAllRelatedCols: any;

	kanbanColsAmount: number = 4;
	kanbanColumns: any[] = [];
	initialBoard: any[] = [{
		name: 'Backlog',
		index: 0,
		max: undefined,
		state: 'new'
	},
	{
		name: 'Implementing',
		index: 1,
		max: undefined,
		state: 'new'
	},
	{
		name: 'Code review',
		index: 2,
		max: undefined,
		state: 'new'
	},
	{
		name: 'Done',
		index: 3,
		max: undefined,
		state: 'new'
	}];

	@Output() updatedTeamOut: EventEmitter<any> = new EventEmitter();
	@Output() isSavedResultSuccesOut: EventEmitter<boolean> = new EventEmitter();
	constructor(private teamService: TeamService, private messageService: MessageService, private userService: UserService, private roleService: RoleService) { }
	ngOnInit() {
		this.userAllRelatedCols = [
			{ field: 'name', header: 'Name' },
			{ field: 'surname', header: 'Surname' },
			{ field: 'login', header: 'Login' },
			{ field: 'email', header: 'Email' },
			{ field: 'roleName', header: 'Role', service: this.roleService }
		];

		this.userCols = [
			{ field: 'name', header: 'Name' },
			{ field: 'surname', header: 'Surname' },
			{ field: 'login', header: 'Login' },
			{ field: 'email', header: 'Email' },
		];
		this.issueAllRelatedCols = this.issueCols = [
			{ field: 'number', header: 'Issue number' },
			{ field: 'name', header: 'Issue name' },
			{ field: 'feature_number', header: 'Feature number' },
			{ field: 'iteration_number', header: 'Iteration number' },
			{ field: 'classification_name', header: 'Classification' },
			{ field: 'status_name', header: 'Status' },
			{ field: 'user_fullname', header: 'Assignee' },
			{ field: 'story_points', header: 'Story Points' },
			{ field: 'isClosed', header: 'Closed' }
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
				team.kanbanColumns = this.kanbanColumns;
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
				team.kanbanColumns = this.kanbanColumns;
				this.teamService.updateTeam(team, this.selectedTeam.id).subscribe((result) => {
					if (result.status === 201) {
						this.updatedTeamOut.emit({
							isNew: false,
							teamID: this.selectedTeam.id,
							updatedProps: team
						});
						this.isSavedResultSuccesOut.emit(true);
						this._clearForm();
					} else {
						this.isSavedResultSuccesOut.emit(false);
						this.messageService.add({ severity: 'error', summary: 'Error', detail: result.message || `Team with ${this.name} name can not be updated.` });
					}
				})
			}
			this.editMode === action;
		}

		if (action === 'add' || action === 'edit') {
			this.editMode = action;
		}
		if (action === 'add') {
			this.kanbanColumns = [];
			this.initialBoard.forEach(element => {
				this.kanbanColumns.push(Object.assign({}, element));
			});
		}
		if (action === 'edit') {
			this.teamService.getKanbanOfTeam({}, this.selectedTeam.id).subscribe((result) => {
				this.kanbanColumns = result;
			});
		}
	}

	_isInputDataInvalid() {
		const hasEmptyCols = this.kanbanColumns.some(element => {
			if (!element.name || element.name === '') {
				return true;
			}
		});
		return hasEmptyCols || this.name === '';
	}

	_clearForm() {
		this.name = '';
		this.selectedTeam = null;
	}

	discard() {
		this._clearForm();
		this.isSavedResultSuccesOut.emit(true);
		this.editMode = null;
	}

	addKanbanColumn() {
		const newColumn = {
			index: this.kanbanColumns.length,
			state: 'new'
		}
		this.kanbanColumns.push(newColumn);
		this.kanbanColsAmount++;
    }

    removeKanbanColumn(i) {
		const col = this.kanbanColumns[i];
		this.kanbanColumns.forEach((el, index) => {
			if (index >= i) {
				if (el.state !== 'new' && el.state !== 'delete') {
					el.state = 'edit';
				}
				el.index--;
			}
		});
		if (!col.state || col.state !== 'new') {
			this.kanbanColumns[i].state = 'delete';
		} else {
			this.kanbanColumns.splice(i, 1);
		}
		this.kanbanColsAmount--;
	}

	kanbanColContentChange(i) {
		if (this.kanbanColumns[i].state !== 'new') {
			this.kanbanColumns[i].state = 'edit';
		}
	}

	selectedRelatedItemToOpenHandler(event) {
		debugger;
		this.selectedRelatedItemToOpen.emit(event);
	}
}
