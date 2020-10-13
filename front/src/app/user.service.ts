import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';
// import { Observable } from 'rxjs';

let serverUrl: string = "https://5d3351cbd7f5.ngrok.io";

let loginUrl: string = serverUrl.concat('/login');
let registerUrl: string = serverUrl.concat('/register');
let uploadImageUrl: string = serverUrl.concat('/upload/profile_img');
let getImageUrl: string = serverUrl.concat('/profile_img/');
let editDetailsUrl: string = serverUrl.concat('/update/user');
let editPasswordUrl: string = serverUrl.concat('/update/password');
let getUsernameUrl: string = serverUrl.concat('/get_username');


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private loggedInStatus = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');

  constructor(
    private http: HttpClient,
  ) {}

  // Login
  login(loginData) {
    const username = loginData.username
    const password = loginData.password
    const data = {
      username: username,
      password: password
    }
    return this.http.post(loginUrl, JSON.stringify(data), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  // setLoggedIn
  setLoggedIn(value: boolean) {
    this.loggedInStatus = value;
    localStorage.setItem('isLoggedIn', 'true');
  }

  // isLoggedIn
  isLoggedIn() {
    return JSON.parse(localStorage.getItem('isLoggedIn') || this.loggedInStatus.toString());
  }

  // register
  register(registerData) {
    const name = registerData.name;
    const surname = registerData.surname;
    const email = registerData.email;
    const phone = registerData.phone;
    const role = registerData.role;
    console.log(role);
    const username = registerData.username;
    const password = registerData.password;
    const data = {
      name: name,
      surname: surname,
      email: email,
      phone: phone,
      role: role,
      username: username,
      password: password,
      accepted: (role == 1 || role == 2) ? 0 : 1
    }
    return this.http.post(registerUrl, JSON.stringify(data), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  // logout
  logout() {
    localStorage.clear();
    window.location.reload();
  }

  // uploadImage
  uploadImage(files) {
    const formData = new FormData();
    // for (const file in files) {
    //   if (Object.prototype.hasOwnProperty.call(files, file)) {
    //     formData.append('file', files[file], files[file].name);
    //   }
    // }
    formData.append('file', files[0], files[0].name);
    formData.append('id', localStorage.getItem('id'));
    return this.http.post(uploadImageUrl, formData);
  }

  // editDetails
  editDetails(data, id) {
    const total_data = {
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: data.phone,
      id: id
    }
    return this.http.post(editDetailsUrl, JSON.stringify(total_data), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  // editPassword
  editPassword(data, id) {
    const total_data = {
      newPassword: data.password,
      id: id
    }
    return this.http.post(editPasswordUrl, JSON.stringify(total_data), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  get_username(data) {
    return this.http.post(getUsernameUrl, JSON.stringify(data), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  getId() {
    return localStorage.getItem('id');
  }

  // getUsername
  getUsername(): string {
    return localStorage.getItem('username');
  }

  // getName
  getName(): string {
    return localStorage.getItem('name');
  }

  // getSurname
  getSurname(): string {
    return localStorage.getItem('surname');
  }

  // getEmail
  getEmail(): string {
    return localStorage.getItem('email');
  }

  // getPhone
  getPhone(): string {
    return localStorage.getItem('phone');
  }

  // getPhoto
  getPhoto() {
    if (localStorage.getItem('profile_img') == 'null')
      return null;
    const image = getImageUrl.concat(localStorage.getItem('profile_img'));
    return image;
  }

  // getRole
  getRole() {
    if (localStorage.getItem('role') == null)
      return '';
    return localStorage.getItem('role');
  }

  // isAdmin
  isAdmin() {
    if (localStorage.getItem('admin') == null)
      return '';
    return localStorage.getItem('admin');
  }

  // getServerUrl
  getServerUrl() {
    return serverUrl;
  }
}
