import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {RequestOptions} from '@angular/http';
import {
	CanActivate, 
	ActivatedRouteSnapshot, 
	RouterStateSnapshot,
	Router
} from '@angular/router'
import {AuthenticateService} from './authenticate.service'
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LoggedOutAuthGuardService implements CanActivate{
	public isLoggedOut: boolean = false;
	public redirectUrl: string;

	constructor(private authService: AuthenticateService, private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
		this.redirectUrl = 'http://localhost:4200/login';
		debugger;
		return this.checkLogin(this.redirectUrl, state, route);
	}

	checkLogin(url: string, state: RouterStateSnapshot, route: ActivatedRouteSnapshot): boolean {
		if (this.isLoggedOut) {
			return true;
		} else {
			this.authService.checkSession().subscribe(
				res => {
          if (res.status === 401) {
            this.isLoggedOut = true;
					  this.router.navigate(['/login']);
          } else {
            this.isLoggedOut = false;
            this.router.navigate(['/admin']);
          }
				}
			);
		}
	}
}
