import { Component, OnInit } from '@angular/core';

import { RoomService } from '../room.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

enum houseType {
  apartment =  'Apartment',
  corporate_apartment = 'Corporate Apartment',
  guest_house = 'Guest House'
}

interface gridItem {
  address:      string,
  airCondition: boolean,
  bathrooms:    number,
  bedrooms:     number,
  beds:         number,
  city:         string,
  costPerNight: number,
  elevator:     boolean,
  end:          Date,
  host:         number,
  id:           number,
  image:        string,
  kitchens:     boolean,
  latitude:     string,
  longitude:    string,
  name:         string,
  parking:      boolean,
  pet:          boolean,
  rating:       number,
  region:       string,
  reviews:      number,
  smoking:      boolean,
  start:        Date,
  tv:           boolean,
  type:         houseType,
  wifi:         boolean,
  description:  string
}

let rooms: gridItem[] = [];

@Component({
  selector: 'app-view-rooms',
  templateUrl: './view-rooms.component.html',
  styleUrls: ['./view-rooms.component.css']
})
export class ViewRoomsComponent implements OnInit {

  results: gridItem[] = rooms;

  constructor(
    public roomService: RoomService,
    public userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('isLoggedIn') == null) {
      this.router.navigate(['']);
    }
    this.getRooms();
  }

  getRooms() {
    this.roomService.getRooms().subscribe(
      res => {
        console.log(res);
        rooms = [];
        this.results = [];
        for (const item in res) {
          if (Object.prototype.hasOwnProperty.call(res, item)) {
            const element = res[item];
            console.log(element);
            element.image = this.roomService.getImagePath().concat(element.id,'/',element.image);
            rooms.push(element);
          }
        }
        this.results = rooms;
      }
    );
  }

  goToRoom(room_id) {
    this.router.navigate(
      ['edit-room'], {
        queryParams: {
          room_id: room_id
        }
      }
    )
  }

}
