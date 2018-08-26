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
	name: string;
	surname: string;
	login: string;
	password: string;
	email: string;
	selectedUsers: User[];
	previousToolbarAction: string;

	@Output() updatedUserOut: EventEmitter<any> = new EventEmitter();
	@Output() isSavedResultSuccesOut: EventEmitter<boolean> = new EventEmitter();

	constructor(private userService: UserService, private messageService: MessageService) { }

	ngOnInit() {
	}

	toolbarActionHandler(action) {
		const user = new User();
		user.name = this.name;
		user.surname = this.surname;
		user.login = this.login;
		user.password = this.password;
		user.email = this.email;

		if (action === 'save') {
			if (this.previousToolbarAction === 'add' || this.previousToolbarAction === 'save') {
				this.userService.insertUser(user).subscribe((result) => {
					if (result) {
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
			}
		}
		this.previousToolbarAction = action;
	}

	_clearForm() {
		this.name = '';
		this.surname = '';
		this.login = '';
		this.password = '';
		this.email = '';
	}

	discard() {
		this._clearForm();
		this.isSavedResultSuccesOut.emit(true);
	}

}
