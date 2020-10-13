import { Component, OnInit } from '@angular/core';

import { AdminService } from '../admin.service';
import { Router } from '@angular/router';

interface User {
  success: string,
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

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  isAdmin: boolean = (localStorage.getItem('admin') == '1') ? true : false;
  displayedColumns: string[] = ['id', 'name', 'surname', 'email', 'phone', 'role', 'username', 'admin'];
  dataSource: User[] = [];


  constructor(
    public adminService: AdminService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('isLoggedIn') == null) {
      this.router.navigate(['']);
    }
    this.adminService.getUsers().subscribe(
      (users: User) => {
        this.dataSource = [];
        for (const key in users) {
          if (Object.prototype.hasOwnProperty.call(users, key)) {
            const element = users[key];
            this.dataSource.push(element);
          }
        }
        // console.log(this.dataSource);
      }
    )
  }

  getJSON() {
    this.adminService.getJSON().subscribe(
      res => {
        var data = [];
        data.push(res);
        var downloadURL = window.URL.createObjectURL(new Blob(data, {type: "application/json"}));
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = "airbnb.json";
        link.click();
      }
    )
  }

  getXML() {
    this.adminService.getXML().subscribe(
      res => {
        var data = [];
        data.push(res);
        var downloadURL = window.URL.createObjectURL(new Blob(data, {type: "application/xml"}));
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = "airbnb.xml";
        link.click();
      }
    )
  }

  goToUser(id, name, surname, email, phone, role, username, admin, profile_img, accepted) {
    this.router.navigate(
      ['user-profile'],{
        queryParams: {
          user_id: id,
          name: name,
          surname: surname,
          email: email,
          phone: phone,
          role: role,
          username: username,
          admin: admin,
          // I need to use original photo url!!!!
          profile_img: profile_img,
          accepted: accepted
        }
      }
    )
  }

}
