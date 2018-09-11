import { Component, OnInit, ViewChild, Output, Input, EventEmitter, SimpleChange } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-relationship-table',
  templateUrl: './relationship-table.component.html',
  styleUrls: ['./relationship-table.component.css'],
  providers: [MessageService]
})
export class RelationshipTableComponent implements OnInit {
 
  @ViewChild('table') table: TableModule;
	//@Output() selectedTeamsOut: EventEmitter<Team[]> = new EventEmitter();
  @Input() updatedItem: any;
  @Input() mainService: any;
  @Input() relatedService: any;
  @Input() type: string;
  @Input() cols: any[];
  
  amountOfItems: number;
	//cols: any[];
	items: any[];
	loading: boolean;
	scrollHeight: string;
	selectedItems: any[];
	selectedItem: any;
	rowsAmount: number = 25;
  isTableDisplayed: boolean = true;
  
  constructor(private messageService: MessageService) { }

  ngOnInit() {
    console.log(this.updatedItem.id)
    this.mainService[`get${this.type}Count`]({}, this.updatedItem.id).subscribe(res => {
		console.log(res)
	  	this.amountOfItems = res[0] && res[0]['sum'];
		});
		/*this.cols = [
			{ field: 'name', header: 'Name' }
    ];*/
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
		this.rowsAmount = amount === -1 ? this.amountOfItems : amount;
		this.loadItemsLazy({
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
				//this.selectedTeams = [];
				//this.selectedTeamsOut.emit(this.selectedTeams);
				break;
			}
		}
	}

	ngOnChanges(changes: SimpleChange) {

		/*console.log(changes['updatedTeam'])
		if (changes['updatedTeam']) {
			const team = changes['updatedTeam'];
			if (team.currentValue && team.currentValue.isNew) {
				this.teams.push(team.currentValue.team);
				this.amountOfTeams++;
				this.table['__proto__'].reset.call(this.table);
				const name = team.currentValue.team.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Team ${name} created successfully.` });
			}
			/*if (user.currentValue && !user.currentValue.isNew) {
				const updatedUser = this.users.find((value, index) => user.currentValue.userID == value.id);
				for (let key of Object.keys(user.currentValue.updatedProps)) {
					updatedUser[key] = user.currentValue.updatedProps[key];
				}
				this.table['__proto__'].reset.call(this.table);
				const name = this._getUserName(updatedUser);
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `User ${name} updated successfully.` });
			}*/
	//	}
	}

	onSelectUnselectRow(event) {
		//this.selectedTeamsOut.emit(this.selectedTeams);
	}

	_refreshGrid(table) {
		this.mainService[`get${this.type}Count`]({}).subscribe(res => {
			this.amountOfItems = res[0]['sum'];
		});
		this.loading = true;
		this.loadItemsLazy({
			first: table.first,
			rows: this.rowsAmount
		});
	}

	_deleteItem(table) {
		for (let i = 0; i < this.selectedItems.length; i++) {
			const arrayIndex = this.items.indexOf(this.selectedItems[i]);
			this.items = this.items.filter((value, index) => arrayIndex != index);
			const selectedId = this.selectedItems[i].id;
			this.amountOfItems--;
      this.selectedItems
      // TODO: не нэйм
			const name = this.selectedItems[i].name;
			this.mainService[`delete${this.type}`]({ id: selectedId }).subscribe(res => {
				this.table['__proto__'].reset.call(this.table);
				this.showSuccess(name);
			});
		}
		this.selectedItems = [];
		//this.selectedTeamsOut.emit(this.selectedTeams);
	}

	showSuccess(name) {
		this.messageService.add({ severity: 'success', summary: 'Success', detail: `${this.type} ${name} deleted successfully.` });
	}

	loadItemsLazy(event) {
		this.loading = true;
		this.mainService[`get${this.type}`]({
			offset: event.first,
			amount: event.rows
		}, this.updatedItem.id).subscribe(items => {
			this.items = items;
			console.log(items);
			this.loading = false;
			this.onResize({});
		});
	}
}
