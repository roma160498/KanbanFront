import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';

import {ErrorStateMatcher} from '@angular/material/core';
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
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  
  constructor(private http: HttpClient) {
    
   }
   emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  matcher = new MyErrorStateMatcher();
  roles = [1, 2, 3];

  role = new FormControl('', Validators.required);
  ngOnInit() {
   /* console.log('123');
    this.http.get('http://localhost:3000/login');*/
  }

  login() {
    // return this.http.post('http://localhost:3000/login', {}); 
  }

}
