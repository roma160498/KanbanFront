import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
	selector: 'app-permission-page',
	templateUrl: './permission-page.component.html',
	styleUrls: ['./permission-page.component.css'],
	providers: [MessageService]
})
export class PermissionPageComponent implements OnInit {
	userList: any = {};
	user_id: any = null;
	initTableValues = [
		{
			sectionName: 'Users',
			get: false,
			update: false,
			create: false,
			delete: false
		},
		{
			sectionName: 'Teams',
			get: false,
			update: false,
			create: false,
			delete: false
		},
		{
			sectionName: 'Products',
			get: false,
			update: false,
			create: false,
			delete: false
		},
		{
			sectionName: 'Features',
			get: false,
			update: false,
			create: false,
			delete: false
		},
		{
			sectionName: 'Issues',
			get: false,
			update: false,
			create: false,
			delete: false
		},
		{
			sectionName: 'Program increments',
			get: false,
			update: false,
			create: false,
			delete: false
		},
		{
			sectionName: 'Iterations',
			get: false,
			update: false,
			create: false,
			delete: false
		}
	];
	sectionsPermissions: any[] = this.initTableValues;
	isCBDisabled: boolean = true;

	permissionMatrix: any = [];

	toolbarButtonsDisabledOptions = {
		isDeleteDisabled: true,
		isEditDisabled: true,
		isSaveDisabled: true,
		isRefreshDisabled: false,
		isRowsDownDisabled: true,
		isAddDisabled: true,
		isFilterDisabled: true
	}

	constructor(private userService: UserService, private messageService: MessageService,) { }

	ngOnInit() {
		this.userService.getUser({}).subscribe(items => {
			this.userList.options = items.map(el => {
				return {
					label: `${el.name} ${el.surname}`,
					value: el.id
				}
			})
		});
	}

	toolbarActionHandler(event) {
		if (event === 'refresh') {
			this.user_id = null;
			this.userService.getUser({}).subscribe(items => {
				this.userList.options = items.map(el => {
					return {
						label: `${el.name} ${el.surname}`,
						value: el.id
					}
				})
			});
			this.resetTableOfPermissions();
		} else if (event === 'save') {
			this.savePermissionsIfNecessary();
		}
	}

	savePermissionsIfNecessary() {
		const currentPermSnap = this.getPermissionSnapshot();
		if (!this.areSnapshotsEqual(this.permissionMatrix, currentPermSnap)) {
			this.userService.updateUserPermission(this.convertUIPermissionToServer(), this.user_id).subscribe(result => {
				if (result) {
					this.messageService.add({ severity: 'success', summary: 'Success', detail: `Permissions saved successfully.` });
					this.permissionMatrix = currentPermSnap;
				} else {
					this.messageService.add({ severity: 'error', summary: 'Error', detail: `Permissions saving failed.` });
				}
			});
		} else {
			this.messageService.add({ severity: 'info', summary: 'Info', detail: `There are no changes to save.` });
		}
	}

	userSelectHandler(event) {
		if (event.value === null) {
			this.resetTableOfPermissions();
		} else {
			this.userService.getUserPermission({}, this.user_id).subscribe(items => {
				const permissionObject = JSON.parse(items[0].permissions);
				this.bindServerPermissionsToUI(permissionObject);
				this.isCBDisabled = false;
				this.permissionMatrix = this.getPermissionSnapshot();
			});
			this.toolbarButtonsDisabledOptions.isSaveDisabled = false;
		}
	}

	bindServerPermissionsToUI(serverJSON) {
		this.sectionsPermissions = [];
		this.sectionsPermissions[0] = {
			sectionName: 'Users',
			get: serverJSON['users'].get,
			update: serverJSON['users'].update,
			create: serverJSON['users'].create,
			delete: serverJSON['users'].delete
		};
		this.sectionsPermissions[1] = {
			sectionName: 'Teams',
			get: serverJSON['teams'].get,
			update: serverJSON['teams'].update,
			create: serverJSON['teams'].create,
			delete: serverJSON['teams'].delete
		};
		this.sectionsPermissions[2] = {
			sectionName: 'Products',
			get: serverJSON['products'].get,
			update: serverJSON['products'].update,
			create: serverJSON['products'].create,
			delete: serverJSON['products'].delete
		};
		this.sectionsPermissions[3] = {
			sectionName: 'Features',
			get: serverJSON['features'].get,
			update: serverJSON['features'].update,
			create: serverJSON['features'].create,
			delete: serverJSON['features'].delete
		};
		this.sectionsPermissions[4] = {
			sectionName: 'Issues',
			get: serverJSON['issues'].get,
			update: serverJSON['issues'].update,
			create: serverJSON['issues'].create,
			delete: serverJSON['issues'].delete
		};
		this.sectionsPermissions[5] = {
			sectionName: 'Program increments',
			get: serverJSON['program increments'].get,
			update: serverJSON['program increments'].update,
			create: serverJSON['program increments'].create,
			delete: serverJSON['program increments'].delete
		};
		this.sectionsPermissions[6] = {
			sectionName: 'Iterations',
			get: serverJSON['iterations'].get,
			update: serverJSON['iterations'].update,
			create: serverJSON['iterations'].create,
			delete: serverJSON['iterations'].delete
		};

	}

	convertUIPermissionToServer() {
		const result = {};
		for (let i = 0; i < this.sectionsPermissions.length; i++) {
			result[this.sectionsPermissions[i].sectionName.toLowerCase()] = {
				get: this.sectionsPermissions[i].get,
				update: this.sectionsPermissions[i].update,
				create: this.sectionsPermissions[i].create,
				delete: this.sectionsPermissions[i].delete
			}
		}
		debugger;
		return result;
	}

	getPermissionSnapshot() {
		const snapshotMatrix = [];
		const permProps = ['get', 'create', 'update', 'delete'];
		for (let i = 0; i < this.sectionsPermissions.length; i++) {
			const permArray = [];
			for (let j = 0; j < 4; j++) {
				permArray.push(this.sectionsPermissions[i][permProps[j]]);
			}
			snapshotMatrix.push(permArray);
		}
		return snapshotMatrix;
	}

	areSnapshotsEqual(first, second) {
		for (let i = 0; i < first.length; i++) {
			for (let j = 0; j < first[i].length; j++) {
				if (first[i][j] !== second[i][j]) {
					return false;
				}
			}
		}
		return true;
	}

	resetTableOfPermissions() {
		this.sectionsPermissions = this.initTableValues;
		this.isCBDisabled = true;
		this.toolbarButtonsDisabledOptions.isSaveDisabled = true;
	}
}
