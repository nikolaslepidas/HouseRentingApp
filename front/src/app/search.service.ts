import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

let serverUrl:          string = "https://5d3351cbd7f5.ngrok.io";
let searchUrl:          string = serverUrl.concat('/search');
let advancedSearchUrl:  string = serverUrl.concat('/advanced_search');
let searchImgsUrl:      string = serverUrl.concat('/apartment_imgs');
let getHostUrl:         string = serverUrl.concat('/get_host');

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

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  
  rooms: gridItem[];

  images: string[] = [];

  diffDates: number;

  constructor(
    private http: HttpClient,
  ) { }

  search(searchTerms) {
    const data = {
      location: searchTerms.location,
      start: searchTerms.fromDate,
      end: searchTerms.toDate,
      guests: this.getGuests(searchTerms.adults, searchTerms.children),
      numDays: this.getMinDays(searchTerms.fromDate, searchTerms.toDate),
      id: (localStorage.getItem('id') != null) ? localStorage.getItem('id') : '0'
    }
    console.log(data);
    if (searchTerms.advanced == '0')
      return this.http.post(searchUrl, JSON.stringify(data), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
    return this.http.post(advancedSearchUrl, JSON.stringify(data), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  searchImgs(id: number) {
      const target = searchImgsUrl.concat('/',id.toString());
      return this.http.get<string[]>(target);
  }

  getHost(id: number) {
    const data = {
      user_id: id
    }
    return this.http.post(getHostUrl, JSON.stringify(data), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  setImgs(images) {
    this.images = images;
  }

  getImgs() {
    return this.images;
  }

  getDiffDays() {
    return this.diffDates;
  }

  setRooms(rooms: gridItem[]) {
    this.rooms = rooms; 
  }

  getRooms() {
    return this.rooms;
  }

  getGuests(adults: string, children: string): number {
    return parseInt(adults) + parseInt(children);
  }

  getMinDays(start: string, end: string): number {
    const startYear   = parseInt(start.substr(0, 4));
    const startMonth  = parseInt(start.substr(5, 2));
    const startDay    = parseInt(start.substr(8, 2));
    const endYear     = parseInt(end.substr(0, 4));
    const endMonth    = parseInt(end.substr(5, 2));
    const endDay      = parseInt(end.substr(8, 2));
    const startDate   = new Date();
    const endDate     = new Date();
    startDate.setFullYear(startYear, startMonth, startDay);
    endDate.setFullYear(endYear, endMonth, endDay);
    this.diffDates    = Math.floor((Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) - Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) ) /(1000 * 60 * 60 * 24));
    return this.diffDates;
  }

  getServerUrl() {
    return serverUrl;
  }

  getImagePath() {
    return serverUrl.concat('/apartment_img/');
  }
}
