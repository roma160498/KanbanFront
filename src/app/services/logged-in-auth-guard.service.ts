import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {RequestOptions} from '@angular/http';
import {
	CanActivate, 
	ActivatedRouteSnapshot, 
	RouterStateSnapshot,
	Router,
	NavigationExtras
} from '@angular/router'
import {AuthenticateService} from './authenticate.service'
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { User } from '../models/user';
@Injectable()
export class LoggedInAuthGuardService implements CanActivate{
	public isLoggedIn: boolean = false;
	public redirectUrl: string;

	constructor(private authService: AuthenticateService, private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
		this.redirectUrl = 'http://localhost:4200/login';
		return this.checkLogin(this.redirectUrl, state);
	}

	checkLogin(url: string, state: RouterStateSnapshot): boolean {
		if (this.isLoggedIn) {
			return true;
		} else {
			this.authService.checkSession().subscribe(
				res => {
					if (res.status === 401) {
						this.isLoggedIn = false;
						this.router.navigate(['/login']);
					} else {
						this.isLoggedIn = true;
						localStorage.setItem('login', res.user.login);
						localStorage.setItem('userName', res.user.name);
						localStorage.setItem('userSurname', res.user.surname);
						localStorage.setItem('id', res.user.id);
						localStorage.setItem('is_admin', res.user.is_admin);
						localStorage.setItem('is_initialPassport', res.user.is_initialPassport);
						localStorage.setItem('permissions', res.user.permissions);
						this.router.navigate(['/admin']);
					}
				}
			);
		}
	}
}
