import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, UrlTree, UrlSegmentGroup, PRIMARY_OUTLET } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import * as L from 'leaflet';

import { SearchService } from '../search.service';
import { RoomService } from '../room.service';
import { BookingMsgComponent } from '../booking-msg/booking-msg.component';
import { UserService } from '../user.service';


enum houseType {
  apartment =  'Apartment',
  corporate_apartment = 'Corporate Apartment',
  guest_house = 'Guest House'
}

interface gridItem {
  address:      string,//
  airCondition: boolean,//
  bathrooms:    number,//
  bedrooms:     number,//
  beds:         number,//
  city:         string,//
  costPerNight: number,//
  elevator:     boolean,//
  end:          Date,//
  host:         number,//
  id:           number,//
  image:        string,//
  kitchens:     boolean,//
  latitude:     string,//
  longitude:    string,//
  name:         string,//
  parking:      boolean,//
  pet:          boolean,//
  rating:       number,
  region:       string,//
  reviews:      number,
  smoking:      boolean,//
  start:        Date,//
  tv:           boolean,//
  type:         houseType,//
  wifi:         boolean,//
  description:  string//
};

interface hostDetails {
  name: string,
  surname: string,
  profile_img: string,
  numReviews: number
}

interface response {
  success: string
}

interface review {
  rating: number,
  review: string
}

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.css']
})
export class RoomDetailComponent implements OnInit {

  url = '';
  tree: UrlTree;
  fragment = '';
  queryParams = {};
  // primary outlet
  primary: UrlSegmentGroup;
  // secondary outlet
  // sidebar: UrlSegmentGroup;

  slideIndex = 1;

  // TODO: Fill this interface with httpClient get method from database
  roomId: number;
  myRoom: gridItem;
  guests: number = 0;
  start:  string;
  end:    string;
  host:   hostDetails;
  images: string[];
  imagesAreReady: boolean = false;
  panelOpenState: boolean = false;
  reviews: review[] = [];
  stars: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public service: SearchService,
    public roomService: RoomService,
    public userService: UserService,
    private bookingMsgDialog: MatDialog,
  ) {
  }
  
  ngOnInit(): void {
    // if (localStorage.getItem('isLoggedIn') == null) {
    //   this.router.navigate(['']);
    // }
    this.parseUrl();
    this.getReviews();
  }
  
  ngAfterViewInit() {
    this.addMap();
    if (this.imagesAreReady)
      this.showSlides(this.slideIndex);
    console.log(this.host);
  }

  setRoom() {
    const rooms = this.service.getRooms();
    for (const item in rooms) {
      if (Object.prototype.hasOwnProperty.call(rooms, item)) {
        const element = rooms[item];
        if (element.id === this.roomId) {
          this.myRoom = element;
          this.getStars();
          break;
        }
      }
    }
  }

  bookRoom() {
    if ((localStorage.getItem('id') == null) || (localStorage.getItem('isLoggedIn') == null) || (this.myRoom.host == parseInt(localStorage.getItem('id'))))
      return;
    const data = {
      start:            this.start,
      end:              this.end,
      guests:           this.guests,
      cost:             this.myRoom.costPerNight,
      user_id:          localStorage.getItem('id'),
      apartment_id:     this.myRoom.id,
      apartment_user_id:this.myRoom.host
    }
    this.roomService.bookRoom(data).subscribe(
      (res: response) => {
        if (res.success == 'true') {
          this.bookingMsgDialog.open(BookingMsgComponent, { data: {success: 'true'}, disableClose: true });
        }
        else {
          this.bookingMsgDialog.open(BookingMsgComponent, { data: {success: 'false'}, disableClose: true });
        }
      }
    )
  }

  getReviews() {
    this.roomService.getReviews(this.roomId).subscribe(
      reviews => {
        this.reviews = [];
        for (const review in reviews) {
          if (Object.prototype.hasOwnProperty.call(reviews, review)) {
            const element = reviews[review];
            this.reviews.push(element);
          }
        }
      }
    )
  }

  getStars() {
    for (let index = 0; index < 5; index++) {
      this.stars.push(index);
    }
  }

  showStar(index) {
    index += 1;
    if ((this.myRoom.rating > index - 1) && (this.myRoom.rating < index))
      return 'star_half';
    if (index <= this.myRoom.rating)
      return 'star';
    if (index > this.myRoom.rating)
      return 'star_border';
  }

  goToChat(receiver_id: number) {
    if (receiver_id === parseInt(localStorage.getItem('id')))
      return;
    this.router.navigate(
      ['chat'],{
        queryParams: {
          recver_id: receiver_id
        }
      }
    )
  }

  addMap() {
    var mymap = L.map('mapid').setView([this.myRoom.latitude, this.myRoom.longitude], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
    }).addTo(mymap);
  
    L.marker([this.myRoom.latitude, this.myRoom.longitude]).addTo(mymap);
  }

  parseUrl(): void {

    this.route.url.subscribe(
      url => {
        this.url          = url.toString();
        this.tree         = this.router.parseUrl(window.location.pathname);
        this.fragment     = this.tree.fragment;
        this.queryParams  = this.tree.queryParams;
        this.primary      = this.tree.root.children[PRIMARY_OUTLET];
      }
    )

    this.route.queryParamMap.subscribe(
      params => {
        this.roomId = parseInt(params.get("unitId"));
        this.guests = parseInt(params.get('adultsCount')) + parseInt(params.get('childrenCount'));
        this.start  = params.get('arrival');
        this.end    = params.get('departure');
        this.service.searchImgs(this.roomId).subscribe(
          res => {
            this.images = [];
            for (const item in res) {
              if (Object.prototype.hasOwnProperty.call(res, item)) {
                const element = res[item];
                this.images.push(this.service.getServerUrl().concat('/apartment_img/',this.roomId.toString(),'/',element[0]));
              }
            }
            if (this.images.length > 0)
              this.imagesAreReady = true;
            this.service.setImgs(this.images);
            this.setRoom();
            this.service.getHost(this.myRoom.host).subscribe(
              (host: hostDetails) => this.host = {
                name: (host as any).name,
                surname: (host as any).surname,
                profile_img: this.service.getServerUrl().concat('/profile_img/',(host as any).profile_img),
                numReviews: (host as any).numReviews
              }
            )
          }
        );
      }
    )

  }

  getTotalCost(): number {
    return this.service.getDiffDays() * this.myRoom.costPerNight;
  }

  /* Image slideshow functions */
  plusSlides(n: number) {
    this.showSlides(this.slideIndex += n);
  }
  
  currentSlide(n: number) {
    this.showSlides(this.slideIndex = n);
  }
  
  showSlides(n: number) {
    let i: number;
    let slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) {
      this.slideIndex = 1;
    }    
    if (n < 1) {
      this.slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].setAttribute('style','display: none;'); 
    }
    slides[this.slideIndex-1].setAttribute('style', 'display: block;');  
  }
  /* Image slideshow functions END */

}
