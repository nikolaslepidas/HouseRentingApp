import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

let serverUrl:    string = "https://5d3351cbd7f5.ngrok.io";

let getUsersUrl:  string = serverUrl.concat('/get_users');
let getJSONUrl:   string = serverUrl.concat('/getJSON');
let getXMLUrl:   string = serverUrl.concat('/getXML');
let acceptHostUrl: string = serverUrl.concat('/accept_host');

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http: HttpClient,
  ) {}

  // getUsers
  getUsers() {
    return this.http.get(getUsersUrl);
  }

  getJSON() {
    return this.http.get(getJSONUrl, { responseType: 'text' });
  }

  getXML() {
    return this.http.get(getXMLUrl, { responseType: 'text' });
  }

  acceptHost(id) {
    const data = {
      accepted: 1,
      id: id
    }
    return this.http.post(acceptHostUrl, JSON.stringify(data), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }
}