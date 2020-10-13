import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../room.service';

interface Reservation {
  id: number,
  start: Date,
  end: Date,
  guests: number,
  cost: number,
  name: string,
  image: string
}

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {

  reservationList: Reservation[] = [];

  constructor(
    private roomService: RoomService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('isLoggedIn') == null) {
      this.router.navigate(['']);
    }
    this.getReservations();
  }

  getReservations() {
    if (localStorage.getItem('id') == null)
      return;
    const data = {
      id: localStorage.getItem('id')
    }
    this.roomService.getReservations(data).subscribe(
      (reservations: Reservation[]) => {
        for (const reservation in reservations) {
          if (Object.prototype.hasOwnProperty.call(reservations, reservation)) {
            this.reservationList.push(reservations[reservation]);
            this.reservationList[reservation].image = this.roomService.getServerUrl().concat('/apartment_img/',reservations[reservation].id.toString(),'/',reservations[reservation].image);
          }
        }
        // Extra code inside subscribe...
      }
    )
  }

}
