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
		private componentLoaderService: ComponentLoaderService, private route: ActivatedRoute) {
		iconRegistry.addSvgIcon('sidenav', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/sidenav.svg'));
		iconRegistry.addSvgIcon('group', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/group.svg'));
		iconRegistry.addSvgIcon('person', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/person.svg'));
		iconRegistry.addSvgIcon('objectives', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/objectives.svg'));
		iconRegistry.addSvgIcon('products', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/objectives.svg'));
		iconRegistry.addSvgIcon('board', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/board.svg'));
		iconRegistry.addSvgIcon('search', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/search.svg'));
		iconRegistry.addSvgIcon('increment', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/increment.svg'));
		iconRegistry.addSvgIcon('iteration', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/iteration.svg'));
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
	ngOnInit() {
		this.userName = localStorage.getItem('userName');
		this.userSurname = localStorage.getItem('userSurname');
	}

	loadBoard() {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		this.componentLoaderService.addComponent(KanbanBoardComponent);
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
}
