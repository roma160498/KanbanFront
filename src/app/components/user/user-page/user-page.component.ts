import { Component, OnInit, ViewChild } from '@angular/core';
import { TableUsersComponent } from '../table-users/table-users.component';
import { User } from '../../../models/user';
import { EditCreateUserComponent } from '../edit-create-user/edit-create-user.component';

@Component({
	selector: 'app-user-page',
	templateUrl: './user-page.component.html',
	styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
	@ViewChild('userTable') tableComponent: TableUsersComponent;
	@ViewChild('editComponent') editComponent: EditCreateUserComponent;
	isTableDisplayed: boolean = true;
	selectedUsers: User[];
	updatedUser: User;
	lastToolbarAction: string;
	toolbarButtonsDisabledOptions: any = {
		isDeleteDisabled: true,
		isEditDisabled: true,
		isSaveDisabled: true,
		isRefreshDisabled: false,
		isRowsDownDisabled: false,
		isAddDisabled: false
	};

	constructor() {
	 }

	ngOnInit() {
	}

	toolbarActionHandler(event) {
		if (event === 'edit') {
			const user = this.selectedUsers[0];
			this.editComponent.name = user.name;
			this.editComponent.surname = user.surname;
			this.editComponent.login = user.login;
			this.editComponent.password = user.password;
			this.editComponent.email = user.email;
			this.editComponent.selectedUser = user;
		}
		this.isTableDisplayed = event === 'add' || event === 'edit' || event === 'save' ? false : true;
		this._updateToolbarButtonsDisabledStates();
		this.tableComponent.toolbarActionHandler(event, {});
		this.editComponent.toolbarActionHandler(event, );
	}

	rowsAmountChangeHandler(event) {
		this.tableComponent.rowsAmountChangeHandler(event, {});
	}

	selectedUsersOut(event) {
		this.selectedUsers = event;
		this._updateToolbarButtonsDisabledStates();
	}

	updatedUserOut(event) {
		this.updatedUser = event;
	}

	isSavedResultSuccesOut(event) {
		this.isTableDisplayed = event;
		if (event) {
			this._updateToolbarButtonsDisabledStates();
		}
	}

	_updateToolbarButtonsDisabledStates() {
		this.toolbarButtonsDisabledOptions = {
			isDeleteDisabled: !(this.selectedUsers && this.selectedUsers.length > 0) || !this.isTableDisplayed,
			isEditDisabled: !(this.selectedUsers && this.selectedUsers.length == 1) || !this.isTableDisplayed,
			isSaveDisabled: this.isTableDisplayed,
			isRefreshDisabled: !this.isTableDisplayed,
			isRowsDownDisabled: !this.isTableDisplayed,
			isAddDisabled: !this.isTableDisplayed
		}
	}
}
