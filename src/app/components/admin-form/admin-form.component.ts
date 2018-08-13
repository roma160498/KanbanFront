import { Component, OnInit, ViewChild, Inject, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user';
import { AuthenticateService } from '../../services/authenticate.service';
import {Router} from '@angular/router';
import {MatSidenav} from '@angular/material/sidenav';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import { LoggedInAuthGuardService } from '../../services/logged-in-auth-guard.service';
import { ComponentLoaderService } from '../../services/component-loader.service'
import {Routes, RouterModule} from '@angular/router';
import { KanbanBoardComponent } from '../kanban-board/kanban-board.component';
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

	constructor(private authenticateService: AuthenticateService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
	private componentLoaderService: ComponentLoaderService) {
		iconRegistry.addSvgIcon('sidenav', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/sidenav.svg'));
		iconRegistry.addSvgIcon('group', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/group.svg'));
		iconRegistry.addSvgIcon('person', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/person.svg'));
		iconRegistry.addSvgIcon('objectives', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/objectives.svg'));
		iconRegistry.addSvgIcon('board', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/board.svg'));
	}

	logout() {
		this.authenticateService.logout();
	}

	ngOnInit() {}

	loadBoard() {
		this.componentLoaderService.setRootViewContainerRef(this.entry);
		this.componentLoaderService.addComponent(KanbanBoardComponent);
	}
}
