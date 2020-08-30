import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder } from '@angular/forms';
import {
	NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { MessageService } from 'primeng/api';
@Component({
	selector: 'app-edit-create-user',
	templateUrl: './edit-create-user.component.html',
	styleUrls: ['./edit-create-user.component.css'],
	providers: [MessageService]
})
export class EditCreateUserComponent implements OnInit {
	selectedUser: User;
	id: number;
	name: string = '';
	surname: string = '';
	login: string = '';
	password: string = '';
	email: string = '';
	is_admin: boolean = false;
	confirmPassword: string = '';
	selectedUsers: User[];
	editMode: string;
	currentUserIsAdmin: boolean;

	@Output() updatedUserOut: EventEmitter<any> = new EventEmitter();
	@Output() isSavedResultSuccesOut: EventEmitter<boolean> = new EventEmitter();

	constructor(private userService: UserService, private messageService: MessageService) { }

	ngOnInit() {
		this.currentUserIsAdmin = localStorage.getItem('is_admin') === '1';
	}

	toolbarActionHandler(action) {
		const user = new User();
		if (action === 'save') {
			if (this._isInputDataInvalid()) {
				this.messageService.add({ severity: 'error', summary: 'Error', detail: `Some of required fields are empty.` });
				return;
			} 
			if (this._checkPasswordConfirmation()) {
				this.messageService.add({ severity: 'error', summary: 'Error', detail: `Password are different.` });
				return;
			}
			if (this.editMode === 'add') {
				user.name = this.name;
				user.surname = this.surname;
				user.login = this.login;
				user.password = this.password;
				user.email = this.email;
				user.is_admin = this.is_admin ? 1 : 0;
				user.is_initialPassword = 1;
				this.userService.insertUser(user, {}).subscribe((result) => {
					if (result) {
						user.id = result.insertId;
						this.updatedUserOut.emit({
							isNew: true,
							user: user 
						});
						this.isSavedResultSuccesOut.emit(true);
						this._clearForm();
					} else {
						this.isSavedResultSuccesOut.emit(false);
						this.messageService.add({ severity: 'error', summary: 'Error', detail: `User with ${this.login} login can not be created.` });
					}
				})
			} else if (this.editMode === 'edit') {
				for (let key in this.selectedUser) {
					if (this[key] !== this.selectedUser[key] && key != 'id' && key != 'is_admin') {
						user[key] = this[key]
					}
					if (key === 'is_admin') {
						user[key] = this[key] ? 1 : 0;
					}
				}
				this.userService.updateUser(user, this.selectedUser.id, {}, {}).subscribe((result)=>{
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
				})
			}
		}

		if (action === 'add' || action === 'edit') {
			this.editMode = action;
		}
	}

	_isInputDataInvalid() {
		return this.login === '' || this.password === '' || this.confirmPassword === '' || this.email === '';
	}

	_checkPasswordConfirmation() {
		return this.password !== this.confirmPassword;
	}

	_clearForm() {
		this.name = '';
		this.surname = '';
		this.login = '';
		this.password = '';
		this.email = '';
		this.confirmPassword = '';
		this.is_admin = false;
		this.selectedUser = null;
	}

	discard() {
		this._clearForm();
		this.isSavedResultSuccesOut.emit(true);
	}

	allowToChangePassword() {
		const user = new User();
		user.is_initialPassword = 1;
		this.userService.updateUser(user, this.selectedUser.id, {}, {}).subscribe((result) => {
			this.messageService.add({ severity: 'success', summary: 'Sucess', detail: `Password change available.` });
		});
	}

}
