import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

interface User {
  id:           number,
  name:         string,
  surname:      string,
  profile_img:  string
}

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {

  userList: User[] = [];
  profileImage: string = this.getPhoto();

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('isLoggedIn') == null) {
      this.router.navigate(['']);
    }
    this.getConversations();
  }

  getConversations() {
    if (localStorage.getItem('id') == null)
      return;
    const data = {
      id: localStorage.getItem('id')
    }
    this.chatService.getConversations(data).subscribe(
      (users: User[]) => {
        for (const user in users) {
          if (Object.prototype.hasOwnProperty.call(users, user)) {
            this.userList.push(users[user]);
            this.userList[user].profile_img = this.chatService.getServerUrl().concat('/profile_img/',users[user].profile_img);
          }
        }
        // Extra code inside subscribe...
      }
    );
  }

  goToChat(user_id: number) {
    this.router.navigate(
      ['chat'], {
        queryParams: {
          recver_id: user_id
        }
      }
    )
  }

  getPhoto() {
    return this.userService.getPhoto();
  }

}
