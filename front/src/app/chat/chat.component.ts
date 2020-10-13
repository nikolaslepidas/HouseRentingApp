import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

import { ChatService } from '../chat.service';
import { UserService } from '../user.service';

interface User {
  username: string
}

interface Message {
  sender_id: number,
  recver_id: number,
  message:   string
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messageForm;
  senderID;
  recverID;
  recverUsername;
  messageList: Message[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private chatService: ChatService,
    private userService: UserService,
  ) {
    this.messageForm = this.formBuilder.group(
      {
        Message: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      });
  }

  ngOnInit(): void {
    if (localStorage.getItem('isLoggedIn') == null) {
      this.router.navigate(['']);
    }
    this.getIds();
    this.getUsername();
    const data = {
      sender_id:    this.senderID,
      receiver_id:  this.recverID
    }
    this.chatService.getMessages(data).subscribe(
      (messages: Message[]) => {
        console.log(messages);
        this.messageList = [];
        this.messageList = messages;
      }
    )
  }

  getIds() {
    this.route.queryParamMap.subscribe(
      params => {
        if (params.get('recver_id') == null) {
          this.router.navigate(['']);
          return;
        }
        this.senderID = localStorage.getItem('id');
        this.recverID = params.get('recver_id');
      }
    );
  }

  sendMessage(message) {
    const data = {
      sender_id:    this.senderID,
      receiver_id:  this.recverID,
      message:      message.Message
    }
    console.log(data)
    this.chatService.sendMessage(data).subscribe(
      res => window.location.reload()
    );
  }

  deleteMessages() {
    const data = {
      sender_id:    this.senderID,
      receiver_id:  this.recverID
    }
    this.chatService.deleteMessages(data).subscribe(
      res => window.location.reload()
    );
  }

  getUsername() {
    const data = {
      id: this.recverID
    }
    this.userService.get_username(data).subscribe(
      (res: User) => {
        this.recverUsername = res.username;
      }
    );
  }

}