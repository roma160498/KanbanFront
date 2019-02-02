import { Component, OnInit, ViewChild, EventEmitter, Output, Input, ElementRef, SimpleChange } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Team } from '../../../models/team';
import { TeamService } from '../../../services/team.service';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
	selector: 'app-table-teams',
	templateUrl: './table-teams.component.html',
	styleUrls: ['./table-teams.component.css'],
	providers: [MessageService]
})
export class TableTeamsComponent implements OnInit {

	@ViewChild('table') table: TableModule;
	@Output() selectedTeamsOut: EventEmitter<Team[]> = new EventEmitter();
	@Input() updatedTeam: any;

	amountOfTeams: number;
	cols: any[];
	teams: Team[];
	scrollHeight: string;
	selectedTeams: Team[];
	selectedTeam: Team;
	rowsAmount: number = 25;
	isTableDisplayed: boolean = true;
	searchIsVisible: boolean = true;

	constructor(private teamService: TeamService, private el: ElementRef, private messageService: MessageService) { }

	ngOnInit() {
		this.cols = [
			{ field: 'name', header: 'Name' }
		];
		this.teamService.getTeam({}).subscribe(teams => {
			this.amountOfTeams = teams.length;
			this.teams = teams;
		});
	}

	_isScrollExist(element): boolean {
		return element.scrollHeight > parseInt(this.scrollHeight);
	}

	rowsAmountChangeHandler(amount, aaa) {
		this.resetTable();
		this.rowsAmount = amount === -1 ? this.amountOfTeams : amount;
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
				this.selectedTeams = [];
				this.selectedTeamsOut.emit(this.selectedTeams);
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
		if (changes['updatedTeam']) {
			const team = changes['updatedTeam'];
			if (team.currentValue && team.currentValue.isNew) {
				this.teams.push(team.currentValue.team);
				this.amountOfTeams++;
				this.resetTable();
				const name = team.currentValue.team.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Team ${name} created successfully.` });
			}
			if (team.currentValue && !team.currentValue.isNew) {
				const updatedTeam = this.teams.find((value, index) => team.currentValue.teamID == value.id);
				for (let key of Object.keys(team.currentValue.updatedProps)) {
					updatedTeam[key] = team.currentValue.updatedProps[key];
				}
				this.resetTable();
				const name = team.currentValue.updatedProps.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Team ${name} updated successfully.` });
			}
		}
	}

	onSelectUnselectRow(event) {
		this.selectedTeamsOut.emit(this.selectedTeams);
	}

	_refreshGrid(table) {
		this.teamService.getTeam({}).subscribe(teams => {
			this.amountOfTeams = this.teams.length;
			this.teams = teams;
		});
		this.clearFilterInputs();
	}

	_deleteItem(table) {
		for (let i = 0; i < this.selectedTeams.length; i++) {
			const arrayIndex = this.teams.indexOf(this.selectedTeams[i]);
			this.teams = this.teams.filter((value, index) => arrayIndex != index);
			const selectedId = this.selectedTeams[i].id;
			this.amountOfTeams--;
			this.selectedTeams
			const name = this.selectedTeams[i].name;
			this.teamService.deleteTeam({ id: selectedId }).subscribe(res => {
				this.resetTable();
				this.showSuccess(name);
			});
		}
		this.selectedTeams = [];
		this.selectedTeamsOut.emit(this.selectedTeams);
	}

	showSuccess(name) {
		this.messageService.add({ severity: 'success', summary: 'Success', detail: `Team ${name} deleted successfully.` });
	}

	resetTable() {
		this.table['__proto__'].reset.call(this.table);
		this.clearFilterInputs();
	}

	clearFilterInputs() {
		const filters = document.getElementsByClassName('filterInput');
		for (let i = 0; i < filters.length; i++) {
			(<HTMLInputElement>filters[i]).value = '';
			this.table['__proto__'].filter.call(this.table, '', this.cols[i].field);
		}
	}
}
