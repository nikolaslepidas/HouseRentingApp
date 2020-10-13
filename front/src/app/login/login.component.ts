import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  checkoutForm;
  hide = true;
  badCredentials: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    // As I understand, when boolean from HeaderComponent becomes true and <app-login> element is rendered
    // the LoginComponent object is basically created and the below headerComponent object in the constructor's arguments
    // is the same headerComponent that calls doLogin() and creates this LoginComponent object.
    // That is the reason why on close() function bool that turns false, does the LoginComponent modal to close.
    private headerComponent: HeaderComponent,
  ) {
    this.checkoutForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z_0-9][a-zA-Z_0-9][a-zA-Z_0-9]*')]),
      password: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9]*')])
    });
  }

  ngOnInit(): void {}

  onSubmit(loginData): void {
    /* TODO: Send these data to login-service in order to do the process is needed */
    const ret = this.headerComponent.login(loginData);
    if (ret === false) {
      this.badCredentials = true;
    }
    else {
      this.badCredentials = false;
      this.close();
    }
    this.checkoutForm.reset();
  }

  close(): void {
    this.checkoutForm.reset();
    this.headerComponent.showLogin = false;
  }

  getErrorMessageUsername(user_len): string {
    if (this.checkoutForm.get('username').hasError('required')) {
      return 'This field is required';
    }
    if (user_len < 3) {
      return 'Username must be at least 3 characters';
    }
    if (this.checkoutForm.get('username').hasError('pattern')) {
      return 'Username is invalid';
    }
    return '';
  }

  getErrorMessagePassword(pass_len): string {
    if (this.checkoutForm.get('password').hasError('required')) {
      return 'This field is required';
    }
    if (pass_len < 8) {  
      return 'Password must be at least 8 characters';
    }
    if (this.checkoutForm.get('password').hasError('pattern')) {
      return 'Password is invalid';
    }
    return '';
  }

}
