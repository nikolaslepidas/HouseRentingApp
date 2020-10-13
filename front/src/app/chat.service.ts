import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

let serverUrl: string = "https://5d3351cbd7f5.ngrok.io";

let sendMsgUrl: string = serverUrl.concat('/add_message');
let getMsgsUrl: string = serverUrl.concat('/get_messages');
let deleteMsgsUrl: string = serverUrl.concat('/delete_messages');
let getConvUrl: string = serverUrl.concat('/get_conversations');

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http: HttpClient,
  ) {}

  sendMessage(data) {
    return this.http.post(sendMsgUrl, JSON.stringify(data), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  getMessages(data) {
    return this.http.post(getMsgsUrl, JSON.stringify(data), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  deleteMessages(data) {
    return this.http.post(deleteMsgsUrl, JSON.stringify(data), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  getConversations(data) {
    return this.http.post(getConvUrl, JSON.stringify(data), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  getServerUrl() {
    return serverUrl;
  }
}
