import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotAcceptedHostComponent } from '../not-accepted-host/not-accepted-host.component';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

interface User {
  admin: number,
  email: string,
  id: number,
  name: string,
  phone: number,
  profile_img: string,
  role: number,
  success: string,
  surname: string,
  username: string,
  accepted: number
}

interface response {
  success: string,
  role: number
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showLogin: boolean;
  showRegister: boolean;


  constructor(
    private router: Router,
    private notAcceptedHostDialog: MatDialog,
    public service: UserService,
  ) {
    this.showLogin    = false;
    this.showRegister = false;
  }

  ngOnInit(): void {}


  login(loginData): boolean {
    // call service function login() with subscribe
    this.service.login(loginData).subscribe(
      (data: User) => {
        if (data.success == 'true') {
          // update localStorage according to the return value of request
          console.log(data);
          this.service.setLoggedIn(true);
          localStorage.setItem('id', (data as any).id);
          localStorage.setItem('username', (data as any).username);
          localStorage.setItem('admin', (data as any).admin);
          localStorage.setItem('email', (data as any).email);
          localStorage.setItem('name', (data as any).name);
          localStorage.setItem('surname', (data as any).surname);
          localStorage.setItem('profile_img', (data as any).profile_img);
          localStorage.setItem('phone', (data as any).phone);
          localStorage.setItem('role', (data as any).role);
          localStorage.setItem('accepted', (data as any).accepted);
          if (localStorage.getItem('admin') == '1') {
            this.router.navigate(['admin-panel']);
            return true;
          }
          if (localStorage.getItem('role') != '0' && localStorage.getItem('accepted') == '0') {
            this.notAcceptedHostDialog.open(NotAcceptedHostComponent, { disableClose: true });
            return false;
          }
          if (localStorage.getItem('role') == '1' || localStorage.getItem('role') == '2') {
            this.router.navigate(['view-rooms']);
            return true;
          }
          return true;
        }
        return false;
      }
    )
    return true;    // typiko return
  }

  doLogin(): void {
    this.showLogin = true;
  }

  register(registerData) {
    this.service.register(registerData).subscribe(
      (data: response) => {
        if (data.success == 'false') {
          this.notAcceptedHostDialog.open(NotAcceptedHostComponent, { data: {success: 'false'} , disableClose: true });
        }
        if (registerData.role == 2 || registerData.role == 1) {
          localStorage.setItem('role', registerData.role.toString());
          this.notAcceptedHostDialog.open(NotAcceptedHostComponent, { disableClose: true });
        }
      }
    )
  }

  editDetails(profileData, userId) {
    this.service.editDetails(profileData, userId).subscribe(
      (res: response) => {
        if (res.success == 'true') {
          localStorage.setItem('name', profileData.name);
          localStorage.setItem('surname', profileData.surname);
          localStorage.setItem('email', profileData.email);
          localStorage.setItem('phone', profileData.phone);
        }
        else {
          console.log('Something went wrong...');
        }
      }
    );
  }

  editPassword(profileData, userId) {
    this.service.editPassword(profileData, userId).subscribe(
      (res: response) => {
        if (res.success == 'true') {
          console.log('Password change success...');
        }
        else {
          console.log('Something went wrong...');
        }
      }
    );
  }

  doRegister(): void {
    this.showRegister = true;
  }

  isAccepted(): boolean {
    return (localStorage.getItem('accepted') == '1') ? true : false;
  }
}
