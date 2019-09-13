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
			component.instance.issueToOpenAtFirstInfo = { issueId:issueId, teamId: teamId };
		}
	}

	loadTeams() {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		this.componentLoaderService.addComponent(TeamPageComponent);
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
	loadIssues() {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		this.componentLoaderService.addComponent(IssuePageComponent);
	}

	loadPermissions() {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		this.componentLoaderService.addComponent(PermissionPageComponent);
	}

	notificationsClick() {
		if (this.notificationsAmount) {
			this.commentService.removeMentionsNofication(localStorage.getItem('id')).subscribe(res => {});
		}
	}
}
