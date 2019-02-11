import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthenticateService } from '../../services/authenticate.service';
import {
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {Router, NavigationExtras} from '@angular/router';
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  providers: [MessageService, AuthenticateService]
})
export class LoginFormComponent implements OnInit {
  username: string;
  password: string;
  constructor(private http: HttpClient, private messageService: MessageService, private authenticateService: AuthenticateService, private router: Router) {

  }

  ngOnInit() {
  }

  login() {
    if (!this.username) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Username is missed.` });
      return;
    }
    if (!this.password) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Password is missed.` });
      return;
    }
    this.authenticateService.login(this.username, this.password).subscribe(res => {

      debugger;
      if (res.status === 200) {
        debugger;
        localStorage.setItem('userName', res.user.name);
        localStorage.setItem('userSurname', res.user.surname);
        localStorage.setItem('id', res.user.id);
        localStorage.setItem('is_admin', res.user.is_admin);
        localStorage.setItem('permissions', res.user.permissions);
        this.router.navigate(['/admin']);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Authentication failed for ${this.username}.` });
        this.username = '';
        this.password = '';
      }
    });
  }

  keyboardHandler(event) {
    if (event.keyCode === 13) {
      this.login();
    }
  }
  showSuccess() {
    
  }
}
