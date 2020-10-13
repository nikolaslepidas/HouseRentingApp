import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, NgForm, FormGroupDirective } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { mismatchPasswordsValidator } from '../shared/mismatch-passwords.directive';
import { ErrorStateMatcher } from '@angular/material/core';

interface Role {
  value: string,
  viewValue: number
}

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  checkoutForm;
  hide_pass = true;
  hide_conf_pass = true;
  roles: Role[] = [
     {value: 'Renter', viewValue: 0},
     {value: 'Host', viewValue: 1},
     {value: 'Both', viewValue: 2},
  ];
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private headerComponent: HeaderComponent
  ) {
    this.checkoutForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z_0-9][a-zA-Z_0-9][a-zA-Z_0-9]*')]),
      password: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9]*')]),
      confirm_password: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9]*')]),
      name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ][a-zA-Z ][a-zA-Z ][a-zA-Z ]*')]),
      surname: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ][a-zA-Z ][a-zA-Z ][a-zA-Z ]*')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern('[1-9][0-9]*')]),
      role: new FormControl('', [Validators.required])
    }, {
      validators: mismatchPasswordsValidator
    });
  }

  ngOnInit(): void {
  }

  onSubmit(registerData): void {
    /* TODO: Send these data to login-service in order to do the process is needed */
    this.headerComponent.register(registerData);
    this.checkoutForm.reset();
    this.close();
  }

  close(): void {
    this.headerComponent.showRegister = false;
    this.checkoutForm.reset();
  }

  getErrorMessageUsername(user_len): string {
    if (this.checkoutForm.get('username').hasError('required')) {
      return 'This field is required';
    }
    if (user_len < 3) {
      return 'Username must be at least 3 characters';
    }
    if (this.checkoutForm.get('username').hasError('pattern')) {
      return 'Username must begin with a letter and continues with letters and/or numbers, _';
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
      return 'Password must include letters and/or numbers, $, _';
    }
    return '';
  }

  getErrorMessagePasswordMatching(): string {
    if (this.checkoutForm.get('confirm_password').hasError('required')) {
      return 'This field is required';
    }
    if (this.checkoutForm.errors?.mismatchPasswords) {
      return 'Passwords do not match';
    }
    return '';
  }

  getErrorMessageName(name_len): string {
    if (this.checkoutForm.get('name').hasError('required')) {
      return 'This field is required';
    }
    if (name_len < 3) {  
      return 'Name must be at least 3 characters';
    }
    if (this.checkoutForm.get('name').hasError('pattern')) {
      return 'Name cannot contain numbers, symbols, etc.';
    }
    return '';
  }

  getErrorMessageSurname(surname_len): string {
    if (this.checkoutForm.get('surname').hasError('required')) {
      return 'This field is required';
    }
    if (surname_len < 3) {  
      return 'Surname must be at least 3 characters';
    }
    if (this.checkoutForm.get('surname').hasError('pattern')) {
      return 'Surname cannot contain numbers, symbols, etc.';
    }
    return '';
  }

  // Maybe I have to add my own validation regex because example@abc is valid with this validator
  getErrorMessageEmail(): string {
    if (this.checkoutForm.get('email').hasError('required')) {
      return 'This field is required';
    }
    if (this.checkoutForm.get('email').hasError('email')) {
      return 'Email not valid';
    }
    return '';
  }

  getErrorMessagePhone(): string {
    if (this.checkoutForm.get('phone').hasError('required')) {
      return 'This field is required';
    }
    if (this.checkoutForm.get('phone').hasError('pattern')) {
      return 'Phone can contain only numbers';
    }
    return '';
  }

  getErrorMessageRole(): string {
    if (this.checkoutForm.get('role').hasError('required')) {
      return 'This field is required';
    }
    return '';
  }

  allValid(): boolean {
    let valid_username = this.checkoutForm.get('username').valid;
    let valid_password = this.checkoutForm.get('password').valid;
    let valid_confirm_password = this.checkoutForm.get('confirm_password').valid;
    let valid_name = this.checkoutForm.get('name').valid;
    let valid_surname = this.checkoutForm.get('surname').valid;
    let valid_email = this.checkoutForm.get('email').valid;
    let valid_phone = this.checkoutForm.get('phone').valid;
    let valid_role = this.checkoutForm.get('role').valid;
    return valid_username && valid_password && valid_confirm_password && valid_name && valid_surname && valid_email && valid_phone && valid_role;
  }

}
