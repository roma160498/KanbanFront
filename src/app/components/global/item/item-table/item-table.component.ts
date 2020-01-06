import { Component, OnInit, ViewChild, Output, Input, EventEmitter, ElementRef, SimpleChange, Injector, ReflectiveInjector } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.css'],
  providers: [MessageService]
})
export class ItemTableComponent implements OnInit {

	@ViewChild('table') table: TableModule;

	@Input() settings: any;
	@Input() typeName: string;
	@Input() singularLabel: string;
	@Input() updatedItem: any;
	@Input() serviceIsLoaded: any;

	// serviceType: any;
	// objectType: any;

	@Input() itemService: any;
	
	
	@Output() selectedItemsOut: EventEmitter<any[]> = new EventEmitter();
	@Output() doubleClickEventOut: EventEmitter<string> = new EventEmitter();
	@Input() canGet: boolean;
	@Input() itemIdToOpen: any;

	amountOfItems: number;
	cols: any[];
	items: any[] = [];
	loading: boolean;
	scrollHeight: string;
	selectedItems: any[];
	selectedItem: any;
	rowsAmount: number = 25;
	isTableDisplayed: boolean = true;
	searchIsVisible: boolean = true;

	constructor(private el: ElementRef, private messageService: MessageService, private inj: Injector) { }

	ngOnInit() {
		this.cols = this.settings.cols.filter(element => !element.notForTable);
	}

	_getTypeFromImportResult(result) {
		return result[Object.keys(result)[0]];
	}

	getItems() {
		if (this.canGet) {
			this.itemService[`get${this.typeName[0].toUpperCase() + this.typeName.slice(1)}`]({}).subscribe(items => {
				this.amountOfItems = items.length;
				this.items = items;
debugger;
				if (this.itemIdToOpen) {
					const itemToOpen = items.find(el => el.id === this.itemIdToOpen);
					this.selectedItems =[itemToOpen];
					this.onSelectUnselectRow({});
					this.doubleCklickHandler();
				}
			});
		}
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
				this.selectedItems = [];
				//this.selectedIncrementsOut.emit(this.selectedIncrements);
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
		if (changes['serviceIsLoaded']) {
			debugger;
			const value = changes['serviceIsLoaded'];
			if (value.currentValue) {
				this.getItems();
			} else {
				return;
			}
		}
		if (changes['updatedItem']) {
			const item = changes['updatedItem'];
			if (item.currentValue && item.currentValue.isNew) {
				this.items.push(item.currentValue.item);
				this.amountOfItems++;
				this.resetTable();
				const name = item.currentValue.item.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Item ${name} created successfully.` });
			}
			if (item.currentValue && !item.currentValue.isNew) {
				const updatedItem = this.items.find((value, index) => item.currentValue.itemID == value.id);
				for (let key of Object.keys(item.currentValue.updatedProps)) {
					if (item.currentValue.updatedProps[key]) {
						updatedItem[key] = item.currentValue.updatedProps[key];
					}
				}
				this.resetTable();
				const name = item.currentValue.updatedProps.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Item ${name} updated successfully.` });
			}
		}
	}

	_refreshGrid(table) {
		this.getItems();
		this.clearFilterInputs();
	}

	_deleteItem(table) {
		for (let i = 0; i < this.selectedItems.length; i++) {
			const arrayIndex = this.items.indexOf(this.selectedItems[i]);
			this.items = this.items.filter((value, index) => arrayIndex != index);
			const selectedId = this.selectedItems[i].id;
			this.amountOfItems--;
			const name = this.selectedItems[i].name;
			this.itemService[`delete${this.typeName[0].toUpperCase() + this.typeName.slice(1)}`]({ id: selectedId }).subscribe(res => {
				this.resetTable();
				this.showSuccess(name);
			});
		}
		this.selectedItems = [];
		this.selectedItemsOut.emit(this.selectedItems);
	}

	showSuccess(name) {
		this.messageService.add({ severity: 'success', summary: 'Success', detail: `${this.singularLabel} ${name} deleted successfully.` });
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

	onSelectUnselectRow(event) {
		this.selectedItemsOut.emit(this.selectedItems);
	}

	rowsAmountChangeHandler(amount, aaa) {
		this.resetTable();
		this.rowsAmount = amount === -1 ? this.amountOfItems : amount;
		this.selectedItems = [];
	}

	doubleCklickHandler() {
		this.doubleClickEventOut.emit('edit');
	}
}
