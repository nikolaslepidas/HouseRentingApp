import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserService } from '../user.service';
import { AdminService } from '../admin.service';
import { ActivatedRoute, Router } from '@angular/router';

interface User {
  id: number,
  name: string,
  surname: string,
  email: string,
  phone: number,
  role: string,
  username: string,
  admin: number,
  profile_img: string,
  accepted: number
}

interface Response {
  success: string
}

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  profileImgUrl;
  checkoutForm;
  passwordForm;
  hide_old_pass = true;
  hide_pass = true;
  hide_conf_pass = true;
  errorMatcher = new CrossFieldErrorMatcher();
  selectedFile: File = null;
  profileImage: string;

  user: User = {
    id: 0,
    name: '',
    surname: '',
    email: '',
    phone: 0,
    role: '',
    username: '',
    admin: 0,
    profile_img: '',
    accepted: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public service: UserService,
    public adminService: AdminService,
  ) {
    this.profileImgUrl = this.service.getServerUrl().concat('/upload/profile_img');
  }

  ngOnInit(): void {
    if (localStorage.getItem('isLoggedIn') == null) {
      this.router.navigate(['']);
    }
    this.parseUrl();
  }

  parseUrl() {
    this.route.queryParamMap.subscribe(
      params => {
        this.user.id          = parseInt(params.get("user_id"));
        this.user.name        = params.get("name");
        this.user.surname     = params.get("surname");
        this.user.email       = params.get("email");
        this.user.phone       = parseInt(params.get("phone"));
        if (params.get("role") == '2')
          this.user.role      = 'Both';
        else if (params.get("role") == '1')
          this.user.role      = 'Host';
        else
          this.user.role      = 'Renter';
        this.user.username    = params.get("username");
        this.user.admin       = parseInt(params.get("admin"));
        if (params.get('profile_img') != null) {
          this.user.profile_img = this.service.getServerUrl().concat('/profile_img/',params.get('profile_img'));
          this.profileImage     = this.user.profile_img;
        }
        else {
          this.user.profile_img = null;
          this.profileImage     = null;
        }
        this.user.accepted    = parseInt(params.get('accepted'));
      }
    )
  }

  getPhoto() {
    return this.service.getPhoto();
  }

  isAccepted(): boolean {
    return (this.user.accepted == 1) ? true : false;
  }

  doAcceptUser() {
    this.adminService.acceptHost(this.user.id).subscribe(
      (res: Response) => {
        if (res.success == 'true') {
          this.router.navigate(
            ['admin-panel']
          )
        }
        // do something on non success
      }
    )
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
    let valid_password = this.passwordForm.get('password').valid;
    let valid_confirm_password = this.passwordForm.get('confirm_password').valid;
    return valid_password && valid_confirm_password;
  }

}
