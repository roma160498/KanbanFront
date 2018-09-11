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
	loading: boolean;
	scrollHeight: string;
	selectedTeams: Team[];
	selectedTeam: Team;
	rowsAmount: number = 25;
  isTableDisplayed: boolean = true;
  
  constructor(private teamService: TeamService, private el: ElementRef, private messageService: MessageService) { }

  ngOnInit() {
    console.log(12)
    this.teamService.getTeamCount({}).subscribe(res => {
      this.amountOfTeams = res[0]['sum'];
      console.log(this.amountOfTeams)
		});
		this.cols = [
			{ field: 'name', header: 'Name' }
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
		this.rowsAmount = amount === -1 ? this.amountOfTeams : amount;
		this.loadTeamsLazy({
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
				this.selectedTeams = [];
				this.selectedTeamsOut.emit(this.selectedTeams);
				break;
			}
		}
	}

	ngOnChanges(changes: SimpleChange) {

		console.log(changes['updatedTeam'])
		if (changes['updatedTeam']) {
			const team = changes['updatedTeam'];
			if (team.currentValue && team.currentValue.isNew) {
				this.teams.push(team.currentValue.team);
				this.amountOfTeams++;
				this.table['__proto__'].reset.call(this.table);
				const name = team.currentValue.team.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Team ${name} created successfully.` });
			}
			if (team.currentValue && !team.currentValue.isNew) {
				console.log("UPDSTE")
				const updatedTeam = this.teams.find((value, index) => team.currentValue.teamID == value.id);
				for (let key of Object.keys(team.currentValue.updatedProps)) {
					updatedTeam[key] = team.currentValue.updatedProps[key];
				}
				this.table['__proto__'].reset.call(this.table);
				console.log(team.currentValue)
				const name = team.currentValue.updatedProps.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Team ${name} updated successfully.` });
			}
		}
	}

	onSelectUnselectRow(event) {
		console.log(this.selectedTeams)
		this.selectedTeamsOut.emit(this.selectedTeams);
	}

	_refreshGrid(table) {
		this.teamService.getTeamCount({}).subscribe(res => {
			this.amountOfTeams = res[0]['sum'];
		});
		this.loading = true;
		this.loadTeamsLazy({
			first: table.first,
			rows: this.rowsAmount
		});
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
				this.table['__proto__'].reset.call(this.table);
				this.showSuccess(name);
			});
		}
		this.selectedTeams = [];
		this.selectedTeamsOut.emit(this.selectedTeams);
	}

	showSuccess(name) {
		this.messageService.add({ severity: 'success', summary: 'Success', detail: `Team ${name} deleted successfully.` });
	}

	loadTeamsLazy(event) {
		this.loading = true;
		this.teamService.getTeam({
			offset: event.first,
			amount: event.rows
		}).subscribe(teams => {
			this.teams = teams;
			this.loading = false;
			this.onResize({});
		});
	}
}
