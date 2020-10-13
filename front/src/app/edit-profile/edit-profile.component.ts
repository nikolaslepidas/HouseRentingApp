import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl, NgForm, FormGroupDirective } from '@angular/forms';
import { mismatchPasswordsValidator } from '../shared/mismatch-passwords.directive';
import { ErrorStateMatcher } from '@angular/material/core';
import { HeaderComponent } from '../header/header.component';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

interface Role {
  value: string,
  viewValue: number
}

interface UploadImage {
  success: string
}

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  profileImgUrl;
  checkoutForm;
  passwordForm;
  hide_old_pass = true;
  hide_pass = true;
  hide_conf_pass = true;
  errorMatcher = new CrossFieldErrorMatcher();
  profileImage: string = this.getPhoto();

  constructor(
    private formBuilder: FormBuilder,
    private headerComponent: HeaderComponent,
    public service: UserService,
    private router: Router,
  ) {
    this.checkoutForm = this.formBuilder.group({
      name: new FormControl(this.headerComponent.service.getName(), [Validators.required, Validators.pattern('[a-zA-Z ][a-zA-Z ][a-zA-Z ][a-zA-Z ]*')]),
      surname: new FormControl(this.headerComponent.service.getSurname(), [Validators.required, Validators.pattern('[a-zA-Z ][a-zA-Z ][a-zA-Z ][a-zA-Z ]*')]),
      email: new FormControl(this.headerComponent.service.getEmail(), [Validators.required, Validators.email]),
      phone: new FormControl(this.headerComponent.service.getPhone(), [Validators.required, Validators.pattern('[1-9][0-9]*')]),
      // role: new FormControl('', [Validators.required])
    });
    this.passwordForm = this.formBuilder.group({
      old_password: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9]*')]),
      password: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9]*')]),
      confirm_password: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9][a-zA-Z_$0-9]*')]),
    }, {
      validators: mismatchPasswordsValidator
    });
    this.profileImgUrl = this.service.getServerUrl().concat('/upload/profile_img');
  }

  ngOnInit(): void {
    if (localStorage.getItem('isLoggedIn') == null) {
      this.router.navigate(['']);
    }
  }

  onSubmitDetails(profileData): void {
    /* TODO: Send these data to login-service in order to do the process is needed */
    this.headerComponent.editDetails(profileData, localStorage.getItem('id'));
    // this.checkoutForm.reset();
  }

  onSubmitPasswords(profileData): void {
    /* TODO: Send these data to login-service in order to do the process is needed */
    this.headerComponent.editPassword(profileData, localStorage.getItem('id'));
    this.passwordForm.reset();
  }

  @ViewChild('fileInput') fileInput;
  onUpload() {
    const files: FileList = this.fileInput.nativeElement.files;
    this.service.uploadImage(files).subscribe(
      (res: UploadImage) => {
        if (res.success == 'true') {
          localStorage.setItem('profile_img', this.service.getId().toString().concat('.', files[0].type.substr(files[0].type.search('/')+1)));
        }
        window.location.reload();
      }
    )
  }

  getPhoto() {
    return this.service.getPhoto();
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
    if (this.passwordForm.get('password').hasError('required')) {
      return 'This field is required';
    }
    if (pass_len < 8) {  
      return 'Password must be at least 8 characters';
    }
    if (this.passwordForm.get('password').hasError('pattern')) {
      return 'Password must include letters and/or numbers, $, _';
    }
    return '';
  }

  getErrorMessagePasswordMatching(): string {
    if (this.passwordForm.get('confirm_password').hasError('required')) {
      return 'This field is required';
    }
    if (this.passwordForm.errors?.mismatchPasswords) {
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

  allDetailsValid(): boolean {
    let valid_name = this.checkoutForm.get('name').valid;
    let valid_surname = this.checkoutForm.get('surname').valid;
    let valid_email = this.checkoutForm.get('email').valid;
    let valid_phone = this.checkoutForm.get('phone').valid;
    // let valid_role = this.checkoutForm.get('role').valid;
    return valid_name && valid_surname && valid_email && valid_phone;
  }

  passwordsValid(): boolean {
    let valid_old_password = this.passwordForm.get('old_password').valid;
    let valid_password = this.passwordForm.get('password').valid;
    let valid_confirm_password = this.passwordForm.get('confirm_password').valid;
    return valid_old_password && valid_password && valid_confirm_password;
  }

}
