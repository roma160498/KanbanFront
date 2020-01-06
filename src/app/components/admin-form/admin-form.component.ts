import { Component, OnInit, ViewChild, Inject, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user';
import { AuthenticateService } from '../../services/authenticate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { LoggedInAuthGuardService } from '../../services/logged-in-auth-guard.service';
import { ComponentLoaderService } from '../../services/component-loader.service'
import { Routes, RouterModule } from '@angular/router';
import { KanbanBoardComponent } from '../kanban-board/kanban-board.component';
import { TableTeamsComponent } from '../team/table-teams/table-teams.component';
import { TableUsersComponent } from '../user/table-users/table-users.component'
import { UserPageComponent } from '../user/user-page/user-page.component'
import { TeamPageComponent } from '../team/team-page/team-page.component';
import { ProductPageComponent } from '../product/product-page/product-page.component';
import { FeaturePageComponent } from '../feature/feature-page/feature-page.component';
import { IncrementPageComponent } from '../increment/increment-page/increment-page.component';
import { IterationPageComponent } from '../iteration/iteration-page/iteration-page.component';
import { IssuePageComponent } from '../issue/issue-page/issue-page.component';
import { PermissionPageComponent } from '../permission/permission-page/permission-page.component';
import { CommentService } from '../../services/comment.service';
import { SequenceHelperService } from '../../services/sequence-helper.service';
import { DateHelperService } from '../../services/date-helper.service';
import { ItemPageComponent } from '../global/item/item-page/item-page.component';
import { Product } from '../../models/product';
import { Feature } from '../../models/feature';

@Component({
	selector: 'app-admin-form',
	templateUrl: './admin-form.component.html',
	providers: [AuthenticateService],
	styleUrls: ['./admin-form.component.css']
})
export class AdminFormComponent implements OnInit {
	@ViewChild('sidenav') sidenav: MatSidenav;
	@ViewChild('container', { read: ViewContainerRef }) entry: ViewContainerRef;
	componentRef: any;
	color: string;
	constructor(private authenticateService: AuthenticateService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
		private componentLoaderService: ComponentLoaderService, private route: ActivatedRoute, private commentService: CommentService,
		private sequenceHelperService: SequenceHelperService, private dateService: DateHelperService) {
		iconRegistry.addSvgIcon('sidenav', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/sidenav.svg'));
		iconRegistry.addSvgIcon('group', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/group.svg'));
		iconRegistry.addSvgIcon('person', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/person.svg'));
		iconRegistry.addSvgIcon('objectives', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/objectives.svg'));
		iconRegistry.addSvgIcon('products', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/objectives.svg'));
		iconRegistry.addSvgIcon('board', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/board.svg'));
		iconRegistry.addSvgIcon('search', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/search.svg'));
		iconRegistry.addSvgIcon('increment', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/increment.svg'));
		iconRegistry.addSvgIcon('iteration', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/iteration.svg'));
		iconRegistry.addSvgIcon('issue', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/issue.svg'));
		iconRegistry.addSvgIcon('message', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/message.svg'));
		iconRegistry.addSvgIcon('reply', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/reply.svg'));
		iconRegistry.addSvgIcon('permission', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/permission.svg'));
		iconRegistry.addSvgIcon('feature', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/feature.svg'));
	}

	logout() {
		this.authenticateService.logout();
	}
	//userInfo: any;
	userInfo = {
		name: 'aaa',
		surname: 'fff'
	};
	userName: string;
	userSurname: string;
	currentUserIsAdmin: boolean;
	notificationsAmount: number;
	notifications: any[];
	ngOnInit() {
		this.userName = localStorage.getItem('userName');
		this.userSurname = localStorage.getItem('userSurname');
		this.currentUserIsAdmin = localStorage.getItem('is_admin') === '1';
		this.commentService.getMessagesWithUser(localStorage.getItem('id')).subscribe(items => {
			this.notificationsAmount = items.length;
			this.notifications = items;
			debugger;
		})
	}

	loadBoard(issueId, teamId) {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		const component = this.componentLoaderService.addComponent(KanbanBoardComponent);
		if (issueId) {
			component.instance.issueToOpenAtFirstInfo = { issueId: issueId, teamId: teamId };
		}
	}

	loadTeamItems() {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		const createdComponent = this.componentLoaderService.addComponent(TeamPageComponent);
		createdComponent.instance.selectedRelatedItemToOpen.subscribe(this.selectedRelatedItemToOpenHandler.bind(this));
	}

	loadUsers() {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		this.componentLoaderService.addComponent(UserPageComponent);
	}

	loadProducts() {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		this.componentLoaderService.addComponent(ProductPageComponent);
	}
	loadFeatures() {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		this.componentLoaderService.addComponent(FeaturePageComponent);
	}

	loadIncrements() {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		this.componentLoaderService.addComponent(IncrementPageComponent);
	}
	loadIterations() {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		this.componentLoaderService.addComponent(IterationPageComponent);
	}
	loadIssueItems(itemId) {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		const createdComponent = this.componentLoaderService.addComponent(IssuePageComponent);
		if (itemId) {
			createdComponent.instance.itemIdToOpen = itemId;
		}
	}

	loadPermissions() {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		this.componentLoaderService.addComponent(PermissionPageComponent);
	}

	selectedRelatedItemToOpenHandler(event) {
		debugger;
		const itemType = event.type;
		const itemId = event.item.id;
		this[`load${itemType}Items`](itemId);
	}

	loadProductItems(itemId) {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		const createdComponent = this.componentLoaderService.addComponent(ItemPageComponent);
		createdComponent.instance.setConfiguration({
			typeName: 'product',
			pluralName: 'products',
			singularLabel: 'Product',
			pluralLabel: 'Products',
			type: Product,
			mainTableSettings: {
				cols: [
					{ field: 'name', label: 'Name', type: 'input', isRequired: true, position: '1.1' },
					{ field: 'description', label: 'Description', type: 'textArea', position: '2.1' }
				]
			},
			relatedServices: ['feature'],
			rowsOnItemForm: [1, 2],
			relationshipsConfig: {
				tabs: [{
					relatedService: 'feature',
					type: 'FeaturesOfProduct',
					relatedItem: 'Feature',
					permissionKey: 'features',
					header: 'Feature Scope',
					relatedCols: [
						{ field: 'name', header: 'Name' },
						{ field: 'increment_number', header: 'Program Increment' },
						{ field: 'creator_name', header: 'Creator' },
						{ field: 'team_name', header: 'Team' },
						{ field: 'type_name', header: 'Classification' },
						{ field: 'status_name', header: 'Status' },
						{ field: 'wsjf', header: 'WSJF' },
						{ field: 'isClosed', header: 'Created' }
					]
				}, {
					relatedService: 'feature',
					type: 'IncrementsOfProduct',
					relatedItem: 'Increment',
					permissionKey: 'program increments',
					header: 'Program Increments',
					relatedCols: [
						{ field: 'number', header: 'Number' },
						{ field: 'name', header: 'Name' },
						{ field: 'start_date', header: 'Started On' },
						{ field: 'end_date', header: 'Ended On' },
						{ field: 'status_name', header: 'Status' }
					]
				}]
			}
		});
		createdComponent.instance.selectedRelatedItemToOpen.subscribe(this.selectedRelatedItemToOpenHandler.bind(this));
		if (itemId) {
			createdComponent.instance.itemIdToOpen = itemId;
		}
	}

	loadUserItems(itemId) {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		const createdComponent = this.componentLoaderService.addComponent(ItemPageComponent);
		createdComponent.instance.setConfiguration({
			typeName: 'user',
			pluralName: 'users',
			singularLabel: 'User',
			pluralLabel: 'Users',
			mainTableSettings: {
				cols: [
					{ field: 'name', label: 'Name', type: 'input', position: '1.1' },
					{ field: 'surname', label: 'Surname', type: 'input', position: '1.2' },
					{ field: 'login', label: 'Login', type: 'input', isRequired: true, position: '2.1' },
					{ field: 'email', label: 'Email', type: 'input', isRequired: true, position: '2.2' },
					{ field: 'password', label: 'Password', type: 'password', isRequired: true, forAdmin: true, position: '3.1' },
					{ field: 'password_confirm', label: 'Confirm password', type: 'password', isRequired: true, forAdmin: true, notForTable: true, confirmOf: 'password', position: '3.2' },
					{ field: 'is_admin', label: 'Is admin', type: 'checkbox', forAdmin: true, notForTable: true, position: '4.1' },
					{
						field: 'is_initialPassword', label: 'Allow to change password', type: 'button', icon: 'pi pi-cog', forAdmin: true, notForTable: true, clickHandler: function (service, contextItem, args) {
							if (contextItem) {
								const user = new User();
								user.is_initialPassword = 1;
								service.updateUser(user, contextItem.id).subscribe((result) => {
									args.messageService.add({ severity: 'success', summary: 'Sucess', detail: `Password change available.` });
								});
							} else {
								args.messageService.add({ severity: 'error', summary: 'Error', detail: `Option is unavailable, item is new.` });
							}
						}, defaultValue: 1, position: '5.1'
					}
				]
			},
			rowsOnItemForm: [1, 2, 3, 4, 5]
		});
		createdComponent.instance.selectedRelatedItemToOpen.subscribe(this.selectedRelatedItemToOpenHandler.bind(this));
		if (itemId) {
			createdComponent.instance.itemIdToOpen = itemId;
		}
	}

	loadIncrementItems(itemId) {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		const createdComponent = this.componentLoaderService.addComponent(ItemPageComponent);
		createdComponent.instance.setConfiguration({
			typeName: 'increment',
			pluralName: 'program increments',
			singularLabel: 'Increment',
			pluralLabel: 'Increments',
			mainTableSettings: {
				cols: [
					{ field: 'number', label: 'Number', type: 'input', readOnly: true, position: '1.1' },// not editable
					{ field: 'name', label: 'Name', type: 'input', isRequired: true, position: '1.2' },
					{ field: 'product_name', label: 'Product', type: 'item', isRequired: true, idField: 'product_id', serviceName: 'product', position: '2.1' },
					{ field: 'product_id', notForForm: true, isRequired: true, notForTable: true },
					{ field: 'status_name', label: 'Status', type: 'dropdown', isRequired: true, idField: 'status_id', getMethod: 'getIncrementStates', position: '2.2' },
					{ field: 'status_id', notForForm: true, isRequired: true, notForTable: true },
					{ field: 'start_date', label: 'Started On', type: 'calendar', isRequired: true, position: '3.1' },
					{ field: 'end_date', label: 'Ended On', type: 'calendar', isRequired: true, position: '3.2' },
					{ field: 'business_objectives', label: 'Business Objectives', type: 'textArea', notForTable: true, position: '4.1' }
				]
			},
			relatedServices: ['product'],
			rowsOnItemForm: [1, 2, 3, 4, 5],
			relationshipsConfig: {
				tabs: [{
					relatedService: 'iteration',
					type: 'IterationsOfIncrement',
					relatedItem: 'Iteration',
					permissionKey: 'features',
					header: 'iterations',
					relatedCols: [
						{ field: 'number', header: 'Iteration number' },
						{ field: 'name', header: 'Iteration name' },
						{ field: 'start_date', header: 'Started On' },
						{ field: 'end_date', header: 'Ended On' },
						{ field: 'story_points', header: 'Story points' },
						{ field: 'status_name', header: 'Status' }
					]
				}, {
					relatedService: 'feature',
					type: 'FeaturesOfIncrement',
					relatedItem: 'Feature',
					permissionKey: 'features',
					header: 'Feature scope',
					relatedCols: [
						{ field: 'number', header: 'Feature Number' },
						{ field: 'name', header: 'Name' },
						{ field: 'creator_name', header: 'Creator' },
						{ field: 'team_name', header: 'Team' },
						{ field: 'type_name', header: 'Classification' },
						{ field: 'status_name', header: 'Status' },
						{ field: 'wsjf', header: 'WSJF' },
						{ field: 'product_name', header: 'Product' },
						{ field: 'isClosed', header: 'Closed' }
					]
				}]
			}
		});
		createdComponent.instance.selectedRelatedItemToOpen.subscribe(this.selectedRelatedItemToOpenHandler.bind(this));
		if (itemId) {
			createdComponent.instance.itemIdToOpen = itemId;
		}
	}

	loadIterationItems(itemId) {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		const createdComponent = this.componentLoaderService.addComponent(ItemPageComponent);
		createdComponent.instance.setConfiguration({
			typeName: 'iteration',
			pluralName: 'iterations',
			singularLabel: 'Iteration',
			pluralLabel: 'Iterations',
			mainTableSettings: {
				cols: [
					{ field: 'number', label: 'Iteration number', type: 'input', readOnly: true, position: '1.1' },
					{ field: 'name', label: 'Iteration name', type: 'input', isRequired: true, position: '1.2' },
					{
						field: 'increment_name', label: 'PI', type: 'item', isRequired: true, idField: 'increment_id', serviceName: 'increment', position: '3.1', getTitle: function (selectedItem) {
							return selectedItem['increment_number'] + '"' + selectedItem['increment_name'] + '"'
						}
					},
					{ field: 'increment_id', notForForm: true, notForTable: true, isRequired: true },
					{ field: 'increment_number', notForForm: true, label: 'PI number' },
					{ field: 'start_date', label: 'Started On', type: 'calendar', isRequired: true, position: '2.1' },
					{ field: 'end_date', label: 'Ended On', type: 'calendar', isRequired: true, position: '2.2' },
					{ field: 'story_points', notForForm: true, label: 'Story points', defaultValue: 0 },
					{ field: 'status_name', label: 'Status', type: 'dropdown', isRequired: true, idField: 'status_id', getMethod: 'getIterationStates', position: '3.2' },
					{ field: 'status_id', notForForm: true, isRequired: true, notForTable: true },
					{ field: 'completeness', label: 'Completeness', notForTable: true, defaultValue: 0, notForForm: true },
					{
						field: 'completeness_visual', label: 'Completeness', type: 'progressBar', notForTable: true, getProgressBarValue: function (item) {
							return Math.round(item.completeness !== 0 ? item.completeness / item.story_points * 100 : 0);
						}, position: '4.1'
					},
				]
			},
			relatedServices: ['increment'],
			rowsOnItemForm: [1, 2, 3, 4],
			relationshipsConfig: {
				tabs: [{
					relatedService: 'issue',
					type: 'IssuesOfIteration',
					relatedItem: 'Iteration',
					permissionKey: 'iterations',
					header: 'Issue scope',
					relatedCols: [
						{ field: 'number', header: 'Issue number' },
						{ field: 'name', header: 'Issue name' },
						{ field: 'feature_number', header: 'Feature number' },
						{ field: 'classification_name', header: 'Classification' },
						{ field: 'status_name', header: 'Status' },
						{ field: 'team_name', header: 'Team' },
						{ field: 'user_fullname', header: 'Assignee' },
						{ field: 'story_points', header: 'Story Points' },
						{ field: 'isClosed', header: 'Closed' }
					]
				}]
			}
		});
		createdComponent.instance.selectedRelatedItemToOpen.subscribe(this.selectedRelatedItemToOpenHandler.bind(this));
		if (itemId) {
			createdComponent.instance.itemIdToOpen = itemId;
		}
	}

	loadFeatureItems(itemId) {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		const createdComponent = this.componentLoaderService.addComponent(ItemPageComponent);
		createdComponent.instance.setConfiguration({
			typeName: 'feature',
			pluralName: 'features',
			singularLabel: 'Feature',
			pluralLabel: 'Features',
			mainTableSettings: {
				cols: [
					{ field: 'number', label: 'Feature number', type: 'input', readOnly: true, position: '1.1' },
					{ field: 'name', label: 'Name', type: 'input', isRequired: true, position: '1.2' },
					{ field: 'creator_name', label: 'Creator', type: 'input', notForForm: true, },
					{ field: 'creater_id', label: '', notForForm: true, notForTable: true, defaultValue: localStorage.getItem('id') },
					{ field: 'description', label: 'Description', type: 'textArea', notForTable: true, defaultValue: '', position: '2.1' },
					{ field: 'acc_criteria', label: 'Acception criteria', type: 'textArea', notForTable: true, defaultValue: '', position: '2.2' },
					{ field: 'created_on', label: 'Created On', type: 'input', readOnly: true, notForTable: true, position: '3.1' },
					{ field: 'modified_on', label: 'Modified On', type: 'input', readOnly: true, notForTable: true, position: '3.2' },
					{ field: 'closed_on', label: 'Closed On', type: 'input', readOnly: true, notForTable: true, position: '3.3' },
					{ field: 'team_name', label: 'Team', type: 'item', idField: 'team_id', serviceName: 'team', position: '5.1' },
					{ field: 'team_id', label: '', notForTable: true, notForForm: true },
					{ field: 'type_name', label: 'Classification', type: 'dropdown', isRequired: true, idField: 'type_id', getMethod: 'getFeatureClassification', position: '4.1' },
					{ field: 'type_id', label: '', notForTable: true, notForForm: true },
					{ field: 'increment_id', notForForm: true, notForTable: true },
					{ field: 'increment_number', type: 'item', label: 'Program Increment', idField: 'increment_id', serviceName: 'increment', position: '4.2' },
					{ field: 'product_name', label: 'Product', type: 'item', idField: 'product_id', isRequired: true, serviceName: 'product', position: '5.2' },
					{ field: 'product_id', label: '', notForTable: true, notForForm: true },
					{ field: 'status_name', label: 'Status', type: 'dropdown', isRequired: true, idField: 'status_id', getMethod: 'getFeatureStates', position: '5.3' },
					{ field: 'status_id', label: '', notForTable: true, notForForm: true },
					{ field: 'ub_value', label: 'User-Business Value', type: 'spinner', notForTable: true, position: '3.4' },
					{ field: 'time_crit', label: 'Time Criticality', type: 'spinner', notForTable: true, position: '3.5' },
					{ field: 'risk_red', label: 'Risk Reduction', type: 'spinner', notForTable: true, position: '4.3' },
					{ field: 'job_size', label: 'Job Size', type: 'spinner', notForTable: true, position: '4.4' },
					{ field: 'wsjf', label: 'WSJF', type: 'input', readOnly: true, position: '5.4' },
					{ field: 'isClosed', label: 'Closed', notForForm: true },
					{
						field: 'isClosed', label: 'Close feature', notForTable: true, type: 'button', icon: 'pi pi-lock', clickHandler: function (service, contextItem, args) {
							debugger;
							if (contextItem) {
								const feature = new Feature()
								if (!contextItem.isClosed) {
									const time = new Date();
									feature.closed_on = args.dateHelper.getDateFormat(time) + ' ' + args.dateHelper.getTimeFormat(time);
								} else {
									feature.closed_on = null;
								}
								service.updateFeature(feature, contextItem.id).subscribe((result) => {
									if (result) {
										contextItem.closed_on = contextItem.closed_on = feature.closed_on;
										contextItem.isClosed = !contextItem.isClosed;
										if (feature.closed_on) {
											args.control.label = 'Reopen feature';
											args.control.icon = 'pi pi-unlock';
										} else {
											args.control.label = 'Close feature';
											args.control.icon = 'pi pi-lock';
										}
										if (contextItem.isClosed) {
											args.messageService.add({ severity: 'success', summary: 'Success', detail: `Feature closed successfully.` });
										} else {
											args.messageService.add({ severity: 'success', summary: 'Success', detail: `Feature reopened successfully.` });
										}
									}
								});
							} else {
								args.messageService.add({ severity: 'error', summary: 'Error', detail: `Option is unavailable, item is new.` });
							}
						}, initHandler: function (contextItem, control) {
							if (contextItem.closed_on) {
								control.label = 'Reopen feature';
								//	this.featureActionIcon = 'pi pi-unlock';
							} else {
								control.label = 'Close feature';
								//	this.featureActionIcon = 'pi pi-lock';
							}
						}, defaultValue: 0, position: '1.3'
					}
				]
			},
			relatedServices: ['increment', 'team', 'product', 'issue'],
			rowsOnItemForm: [1, 2, 3, 4, 5, 6],
			relationshipsConfig: {
				tabs: [{
					relatedService: 'issue',
					type: 'IssuesOfFeature',
					relatedItem: 'Issue',
					permissionKey: 'issues',
					header: 'Issue Scope',
					relatedCols: [
						{ field: 'number', header: 'Issue number' },
						{ field: 'name', header: 'Issue name' },
						{ field: 'iteration_number', header: 'Iteration number' },
						{ field: 'classification_name', header: 'Classification' },
						{ field: 'status_name', header: 'Status' },
						{ field: 'team_name', header: 'Team' },
						{ field: 'user_fullname', header: 'Assignee' },
						{ field: 'story_points', header: 'Story Points' },
						{ field: 'isClosed', header: 'Closed' }
					]
				}]
			}
		});
		createdComponent.instance.selectedRelatedItemToOpen.subscribe(this.selectedRelatedItemToOpenHandler.bind(this));
		if (itemId) {
			createdComponent.instance.itemIdToOpen = itemId;
		}
	}

	loadTestItem6() {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		const createdComponent = this.componentLoaderService.addComponent(ItemPageComponent);
		createdComponent.instance.setConfiguration({
			typeName: 'issue',
			pluralName: 'issues',
			singularLabel: 'Issue',
			pluralLabel: 'Issues',
			mainTableSettings: {
				cols: [
					{ field: 'number', label: 'Issue Number', type: 'input', readOnly: true, position: '1.1' },
					{ field: 'name', label: 'Issue Name', type: 'input', isRequired: true, position: '1.2' },
					{ field: 'feature_number', label: 'Feature', type: 'item', idField: 'feature_id', serviceName: 'feature', position: '3.1' },
					{ field: 'feature_id', label: '', notForTable: true, notForForm: true },
					{ field: 'iteration_id', notForForm: true, notForTable: true },
					{ field: 'iteration_number', type: 'item', label: 'Iteration', idField: 'iteration_id', serviceName: 'iteration', position: '3.2' },
					{ field: 'classification_name', label: 'Classification', type: 'dropdown', isRequired: true, idField: 'classification_id', getMethod: 'getIssueClassification', position: '1.3' },
					{ field: 'classification_id', label: '', notForTable: true, notForForm: true },
					{ field: 'status_name', label: 'Status', type: 'dropdown', isRequired: true, idField: 'status_id', getMethod: 'getIssueStates', position: '5.3' },
					{ field: 'status_id', label: '', notForTable: true, notForForm: true },
					{
						field: 'team_name', label: 'Team', type: 'item', idField: 'team_id', serviceName: 'team', position: '4.1', selectHandler: function (event, itemService, contextItem) {
							itemService.getKanbanOfTeam({}, event.value).subscribe(items => {
								contextItem.statusList.options = items.map(el => {
									return {
										label: el.name,
										value: el.id
									}
								});
								//contextItem.status_id = idToSelect ? idToSelect : items[0] && items[0].id;
							});
						}
					},
					{ field: 'team_id', label: '', notForTable: true, notForForm: true },
					{ field: 'user_fullname', label: 'Assignee', type: 'input', position: '4.2' },
					{ field: 'story_points', label: 'Story points', type: 'input', position: '5.1' },
					{ field: 'completeness', label: 'Completeness', type: 'dropdown', idField: 'completeness', position: '5.2' },
					{ field: 'isClosed', label: 'Closed', notForForm: true },
					{ field: 'description', label: 'Description', type: 'textArea', notForTable: true, defaultValue: '', position: '6.1' },
					{ field: 'accCriteria', label: 'Acception criteria', type: 'textArea', notForTable: true, defaultValue: '', position: '6.2' },
					{ field: 'created_on', label: 'Created On', type: 'input', readOnly: true, notForTable: true, position: '7.1' },
					{ field: 'modified_on', label: 'Modified On', type: 'input', readOnly: true, notForTable: true, position: '7.2' },
					{ field: 'closed_on', label: 'Closed On', type: 'input', readOnly: true, notForTable: true, position: '7.3' },


					// { field: 'creator_name', label: 'Creator', type: 'input', notForTable: true, notForForm: true, },
					// { field: 'creater_id', label: '', notForForm: true, notForTable: true, defaultValue: localStorage.getItem('id')},
					// { field: 'description', label: 'Description', type: 'textArea', notForTable: true, defaultValue: '', position: '2.1' },
					// { field: 'acc_criteria', label: 'Acception criteria', type: 'textArea', notForTable: true, defaultValue: '', position: '2.2' },
					// { field: 'created_on', label: 'Created On', type: 'input', readOnly: true, notForTable: true, position: '3.1' },
					// { field: 'modified_on', label: 'Modified On', type: 'input', readOnly: true, notForTable: true, position: '3.2' },
					// { field: 'closed_on', label: 'Closed On', type: 'input', readOnly: true, notForTable: true, position: '3.3' },
					// { field: 'increment_id', notForForm: true, notForTable: true },
					// { field: 'increment_number', type: 'item', label: 'Program Increment', idField: 'increment_id', serviceName: 'increment', notForTable: true,position:'4.2' },
					// { field: 'product_name', label: 'Product', type: 'item',notForTable: true, idField: 'product_id', isRequired: true, serviceName: 'product', position: '5.2' },
					// { field: 'product_id', label: '', notForTable: true, notForForm: true},
					// { field: 'status_name', label: 'Status', type: 'dropdown', isRequired: true,notForTable: true, idField: 'status_id', getMethod: 'getFeatureStates', position: '5.3' },
					// { field: 'status_id', label: '', notForTable: true, notForForm: true},
					// { field: 'ub_value', label: 'User-Business Value', type: 'spinner', notForTable: true, position: '3.4' },
					// { field: 'time_crit', label: 'Time Criticality', type: 'spinner', notForTable: true, position: '3.5' },
					// { field: 'risk_red', label: 'Risk Reduction', type: 'spinner', notForTable: true, position: '4.3' },
					// { field: 'job_size', label: 'Job Size', type: 'spinner', notForTable: true, position: '4.4' },
					// { field: 'wsjf', label: 'WSJF', type: 'input', readOnly: true, notForTable: true,position: '5.4' },

					// {
					// 	field: 'isClosed', label: 'Close feature', notForTable: true, type: 'button', icon: 'pi pi-lock', clickHandler: function (service, contextItem, args) {
					// 		debugger;
					// 		if (contextItem) {
					// 			const feature = new Feature()
					// 			if (!contextItem.isClosed) {
					// 				const time = new Date();
					// 				feature.closed_on = args.dateHelper.getDateFormat(time) + ' ' + args.dateHelper.getTimeFormat(time);
					// 			} else {
					// 				feature.closed_on = null;
					// 			}
					// 			service.updateFeature(feature, contextItem.id).subscribe((result) => {
					// 				if (result) {
					// 					contextItem.closed_on = contextItem.closed_on = feature.closed_on;
					// 					contextItem.isClosed = !contextItem.isClosed;
					// 					if (feature.closed_on) {
					// 						args.control.label = 'Reopen feature';
					// 						args.control.icon = 'pi pi-unlock';
					// 					} else {
					// 						args.control.label = 'Close feature';
					// 						args.control.icon = 'pi pi-lock';
					// 					}
					// 					if (contextItem.isClosed) {
					// 						args.messageService.add({ severity: 'success', summary: 'Success', detail: `Feature closed successfully.` });
					// 					} else {
					// 						args.messageService.add({ severity: 'success', summary: 'Success', detail: `Feature reopened successfully.` });
					// 					}
					// 				}
					// 			});
					// 		} else {
					// 			args.messageService.add({ severity: 'error', summary: 'Error', detail: `Option is unavailable, item is new.` });
					// 		}
					// 	}, initHandler: function(contextItem, control) {
					// 		if (contextItem.closed_on) {
					// 			control.label = 'Reopen feature';
					// 		//	this.featureActionIcon = 'pi pi-unlock';
					// 		} else {
					// 			control.label = 'Close feature';
					// 		//	this.featureActionIcon = 'pi pi-lock';
					// 		}
					// 	}, defaultValue: 0, position: '1.3'
					// }
				]
			},
			relatedServices: ['iteration', 'team', 'feature'],
			rowsOnItemForm: [1, 2, 3, 4, 5, 6, 7]
		});
	}

	notificationsClick() {
		if (this.notificationsAmount) {
			this.commentService.removeMentionsNofication(localStorage.getItem('id')).subscribe(res => { });
		}
	}
}
