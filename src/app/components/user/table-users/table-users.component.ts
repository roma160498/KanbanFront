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
	@Input() canGet: boolean;

	currentUserIsAdmin: boolean;
	amountOfUsers: number;
	cols: any[];
	users: User[];
	scrollHeight: string;
	selectedUsers: User[];
	selectedUser: User;
	rowsAmount: number = 25;
	isTableDisplayed: boolean = true;
	searchIsVisible: boolean = true;
	constructor(private userService: UserService, private el: ElementRef, private messageService: MessageService) { }

	ngOnInit() {
		this.currentUserIsAdmin = localStorage.getItem('is_admin') === '1';
		this.cols = [
			{ field: 'name', header: 'Name' },
			{ field: 'surname', header: 'Surname' },
			{ field: 'login', header: 'Login' },
			{ field: 'password', header: 'Password', forAdmin: true },
			{ field: 'email', header: 'Email' }
		];
		this.getUsers();
	}

	getUsers() {
		if (this.canGet) {
			this.userService.getUser({}).subscribe(users => {
				this.amountOfUsers = users.length;
				this.users = users;
			});
		}
	}

	_isScrollExist(element): boolean {
		return element.scrollHeight > parseInt(this.scrollHeight);
	}

	rowsAmountChangeHandler(amount, aaa) {
		this.resetTable();
		this.rowsAmount = amount === -1 ? this.amountOfUsers : amount;
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
			case 'filter': {
				this.searchIsVisible = !this.searchIsVisible;
				if (!this.searchIsVisible) {
					this.clearFilterInputs();
				}
			}
		}
	}

	ngOnChanges(changes: SimpleChange) {
		if (changes['updatedUser']) {
			const user = changes['updatedUser'];
			if (user.currentValue && user.currentValue.isNew) {
				this.users.push(user.currentValue.user);
				this.amountOfUsers++;
				this.resetTable();
				const name = this._getUserName(user.currentValue.user);
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `User ${name} created successfully.` });
			}
			if (user.currentValue && !user.currentValue.isNew) {
				const updatedUser = this.users.find((value, index) => user.currentValue.userID == value.id);
				for (let key of Object.keys(user.currentValue.updatedProps)) {
					updatedUser[key] = user.currentValue.updatedProps[key];
				}
				this.resetTable();
				const name = this._getUserName(updatedUser);
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `User ${name} updated successfully.` });
			}
		}
	}

	onSelectUnselectRow(event) {
		this.selectedUsersOut.emit(this.selectedUsers);
	}

	_refreshGrid(table) {
		this.getUsers();
		this.clearFilterInputs();
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
				this.resetTable();
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
