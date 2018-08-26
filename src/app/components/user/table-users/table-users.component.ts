import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef, Output, EventEmitter, SimpleChange, Input } from '@angular/core';
import { User } from '../../../models/user'
import { UserService } from '../../../services/user.service'
import { LazyLoadEvent, MenuItem } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import {
	NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {TableModule} from 'primeng/table';

@Component({
	selector: 'app-table-users',
	templateUrl: './table-users.component.html',
	styleUrls: ['./table-users.component.css'],
	providers: [MessageService]
})
export class TableUsersComponent implements OnInit {

	@ViewChild('table') table: TableModule;
	@Output() selectedUsersOut: EventEmitter<User[]> = new EventEmitter();
	@Input() updatedUser: any;

	amountOfUsers: number;
	cols: any[];
	users: User[];
	loading: boolean;
	scrollHeight: string;
	selectedUsers: User[];
	selectedUser: User;
	rowsAmount: number = 25;
	isTableDisplayed: boolean = true;
	constructor(private userService: UserService, private el: ElementRef, private messageService: MessageService) { }

	ngOnInit() {
		this.userService.getUserCount({}).subscribe(res => {
			this.amountOfUsers = res[0]['sum'];
		});
		this.cols = [
			{ field: 'name', header: 'Name' },
			{ field: 'surname', header: 'Surname' },
			{ field: 'login', header: 'Login' },
			{ field: 'password', header: 'Password' },
			{ field: 'email', header: 'Email' }
		];
		this.loading = true;
	}

	_isScrollExist(element): boolean {
		return element.scrollHeight > parseInt(this.scrollHeight);
	}

	onResize(event) {
		this.scrollHeight = this.el.nativeElement.getElementsByTagName('p-table')[0].firstElementChild.offsetHeight - 70 + 'px';
		const header: HTMLElement = <HTMLElement>document.getElementsByClassName('ui-table-scrollable-header')[0];
		if (this._isScrollExist(this.el.nativeElement.getElementsByClassName('ui-table-scrollable-body-table')[0])) {
			header.style.marginRight = '17px';
		} else {
			header.style.marginRight = '0px';
		}
	}

	rowsAmountChangeHandler(amount, aaa) {
		this.table['__proto__'].reset.call(this.table);
		this.rowsAmount = amount === -1 ? this.amountOfUsers : amount;
		this.loadUsersLazy({
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
				this.selectedUsers = [];
				this.selectedUsersOut.emit(this.selectedUsers);
				break;
			}
		}
	}

	ngOnChanges(changes: SimpleChange) {
		console.log(changes)
		if (changes['updatedUser']) {
			const user = changes['updatedUser'];
			if (user.currentValue && user.currentValue.isNew) {
				this.users.push(user.currentValue.user);
				this.amountOfUsers++;
				this.table['__proto__'].reset.call(this.table);
				const name = this._getUserName(user.currentValue.user);
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `User ${name} created successfully.` });
			}
		}
	}

	onSelectUnselectRow(event) {
		this.selectedUsersOut.emit(this.selectedUsers);
	}

	_refreshGrid(table) {
		this.userService.getUserCount({}).subscribe(res => {
			this.amountOfUsers = res[0]['sum'];
		});
		this.loading = true;
		this.loadUsersLazy({
			first: table.first,
			rows: this.rowsAmount
		});
	}

	_deleteItem(table) {
		for (let i = 0; i < this.selectedUsers.length; i++) {
			const arrayIndex = this.users.indexOf(this.selectedUsers[i]);
			this.users = this.users.filter((value, index) => arrayIndex != index);
			const selectedId = this.selectedUsers[i].id;
			this.amountOfUsers--;
			this.selectedUsers
			const name = this._getUserName(this.selectedUsers[i]);
			this.userService.deleteUser({ id: selectedId }).subscribe(res => {
				this.table['__proto__'].reset.call(this.table);
				this.showSuccess(name);
			});
		}
		this.selectedUsers = [];
		this.selectedUsersOut.emit(this.selectedUsers);
	}

	_getUserName(selectedUser: User): string {
		const name = selectedUser.name ? selectedUser.name : '';
		const surname = selectedUser.surname ? selectedUser.surname : '';
		const result = name + ' ' + surname;
		return result === ' ' ? selectedUser.login : result;
	}

	_insertUser(table) {

	}

	showSuccess(name) {
		this.messageService.add({ severity: 'success', summary: 'Success', detail: `User ${name} deleted successfully.` });
	}

	loadUsersLazy(event) {
		this.loading = true;
		this.userService.getUser({
			offset: event.first,
			amount: event.rows
		}).subscribe(users => {
			this.users = users;
			this.loading = false;
			this.onResize({});
		});
	}
}
