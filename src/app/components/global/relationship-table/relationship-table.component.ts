import { Component, OnInit, ViewChild, Output, Input, EventEmitter, SimpleChange, Inject, ViewContainerRef } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/components/common/messageservice';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditCreateUserComponent } from '../../user/edit-create-user/edit-create-user.component';
import { SelectItem } from 'primeng/components/common/api';
import { OverlayPanel } from 'primeng/components/overlaypanel/overlaypanel';

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
	@Input() nativeCols: any[];
	@Input() relatedItem: string;
	@Input() toolbarButtonsInitialState: any;
	@Input() canGet: boolean;

	amountOfItems: number;
	specialCols = [];
	items: any[] = [];
	itemsForSearchGrid: any[];
	loading: boolean;
	scrollHeight: string;
	selectedItems: any[];
	selectedItem: any;
	relatedSelectedItem: any;
	rowsAmount: number = 25;
	isTableDisplayed: boolean = true;
	isSideBarVisible: false;
	results: any;
	cities: any[];
	selectedPopup: any;
	selectedSpecialCol: any;
	searchIsVisible: boolean = true;
	searchLabel: string = 'Hide Search';

	constructor(private messageService: MessageService, public dialog: MatDialog) { }

	ngOnInit() {
		if (this.canGet) {
			this.mainService[`get${this.type}`]({}, this.updatedItem.id).subscribe(items => {
				this.items = items;
				this.loading = false;
				this.onResize({});
			});
		}
		this.loading = true;
		for (let col of this.cols) {
			if (col['service'])
				this.specialCols.push(col);
		}

		for (let specialCol of this.specialCols) {
			specialCol.service[`get${specialCol.header}`]({}).subscribe(items => {
				specialCol.options = items.map(el => {
					return {
						label: el.name,
						value: el.id
					}
				});
			});
		}
	}

	_isScrollExist(element): boolean {
		return element.scrollHeight > parseInt(this.scrollHeight);
	}

	onResize(event) {
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
				this.relatedService[`get${this.relatedItem}`]({}).subscribe(items => {
					this.itemsForSearchGrid = items;
					this.loading = false;
				});
				break;
			}
			case 'save': {
				let newItems = [];
				let updatedItems = [];
				for (let item of this.items) {
					if (item.isNew) {
						// проверяем заполнены ли специальны поля
						for (let i = 0; i < this.specialCols.length; i++) {
							if (!item[this.specialCols[i].field]) {
								this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please, fill special coloumns.` });
								return;
							}
						}
						delete item.isNew;
						newItems.push(item);
					}
					if (item.isUpdated) {
						delete item.isUpdated;
						updatedItems.push(item);
					}
				}
				if (newItems.length) {
					this.mainService[`insert${this.type}`](this.updatedItem.id, newItems).subscribe(() => {
						this.messageService.add({ severity: 'success', summary: 'Sucess', detail: `Items were added successfully.` });
						this.searchIsVisible = true;
					});
				}
				if (updatedItems.length) {
					for (let i = 0; i < updatedItems.length; i++) {
						this.mainService[`update${this.type}`](this.updatedItem.id, updatedItems[i].id, updatedItems[i]).subscribe(() => {
							this.messageService.add({ severity: 'success', summary: 'Sucess', detail: `Item was updated successfully.` });
							this.searchIsVisible = true;
						});
					}

				}
			}
			case 'hideSearch': {
				this.searchIsVisible = !this.searchIsVisible;
				if (this.searchIsVisible) {
					this.searchLabel = 'Hide Search';
				} else {
					this.searchLabel = 'Show Search';
				}
				this.table['__proto__'].reset.call(this.table);
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
		if (this.canGet) {
			this.mainService[`get${this.type}Count`]({}).subscribe(res => {
				this.amountOfItems = res[0]['sum'];
			});
			this.loading = true;
			this.loadItemsLazy({});
		}
	}

	_deleteItem(table) {
		for (let i = 0; i < this.selectedItems.length; i++) {
			const arrayIndex = this.items.indexOf(this.selectedItems[i]);
			this.items = this.items.filter((value, index) => arrayIndex != index);
			console.log(this.selectedItems[i])
			const selectedId = this.selectedItems[i].id;
			this.amountOfItems--;
			this.selectedItems
			// TODO: не нэйм
			const name = this.selectedItems[i].name;
			this.mainService[`delete${this.type}`](this.updatedItem.id, selectedId).subscribe(res => {
				this.table['__proto__'].reset.call(this.table);
				this.showSuccess(name);
			});
		}
		this.selectedItems = [];
		//this.selectedTeamsOut.emit(this.selectedTeams);
	}

	showSuccess(name) {
		this.messageService.add({ severity: 'success', summary: 'Success', detail: `Item deleted successfully.` });
	}

	loadItemsLazy(event) {
		this.loading = true;
		this.mainService[`get${this.type}`]({}, this.updatedItem.id).subscribe(items => {
			this.items = items;
			this.loading = false;
			this.onResize({});
		});
	}

	_addRelated() {
		if (this.relatedSelectedItem) {
			if (this.items.some((el) => el.id === this.relatedSelectedItem.id)) {
				this.isSideBarVisible = false;
				this.messageService.add({ severity: 'error', summary: 'Error', detail: `Such item is already exist.` });
				return;
			}
			this.relatedSelectedItem.isNew = true;
			const newItem = this.relatedSelectedItem;
			this.items.push(newItem);
			this.relatedSelectedItem = null;
			this.isSideBarVisible = false;
		} else {
			this.isSideBarVisible = false;
			this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please, select new item.` });
		}
	}
	_cancelRelated() {
		this.isSideBarVisible = false;
		this.relatedSelectedItem = false;
	}
	openLayout(event, overlaypanel: OverlayPanel, colName, item) {
		this.selectedItems = [];
		this.selectedItems.push(item);
		const abc = document.getElementsByClassName('mat-sidenav-content')[0];
		const a = getComputedStyle(abc);
		const specialCol = this.specialCols.filter((el) => el.header == colName)[0];
		this.selectedSpecialCol = specialCol;
		overlaypanel.toggle(event);
		setTimeout(() => {
			const bbb: HTMLElement = <HTMLElement>document.getElementsByClassName('ui-overlaypanel')[0];
			bbb.style.left = (parseInt(bbb.style.left) - parseInt(a.marginLeft) + 40) + 'px';
			bbb.style.top = (parseInt(bbb.style.top) - 130) + 'px';
		});
	}

	popupLayoutClick(event, overlaypanel: OverlayPanel) {
		if (this.selectedPopup) {
			const colName = this.selectedSpecialCol.field;
			const currentRelatedItem = this.selectedItems[0];
			const col = this.selectedSpecialCol.options.filter((el) => el.value == this.selectedPopup)[0];
			if (col) {
				currentRelatedItem[colName] = col.label;
				if (!currentRelatedItem.isNew) {
					currentRelatedItem.isUpdated = true;
				}
				overlaypanel.hide();
				this.selectedPopup = null;
			}
		}
	}
}
