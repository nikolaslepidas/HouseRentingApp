import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

let serverUrl: string = "https://5d3351cbd7f5.ngrok.io";

let addRoomUrl: string = serverUrl.concat('/add_apartment');
let updateRoomUrl: string = serverUrl.concat('/update_apartment');
let getRoomsUrl: string = serverUrl.concat('/get_apartments');
let bookRoomUrl: string = serverUrl.concat('/book');
let getReviewsUrl: string = serverUrl.concat('/apartment/get_reviews');
let getReservationsUrl: string = serverUrl.concat('/get_reservations');
let uploadImageUrl: string = serverUrl.concat('/upload/apartment_img');
let uploadImagesUrl: string = serverUrl.concat('/upload/apartment_imgs');
let removeImagesUrl: string = serverUrl.concat('/delete/apartment_imgs');


@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(
    private http: HttpClient,
  ) {}

  // AddRoom
  addRoom(roomData) {
    return this.http.post(addRoomUrl, JSON.stringify(roomData), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  // getRooms
  getRooms() {
    const hostId = {
      user_id: localStorage.getItem('id')
    }
    return this.http.post(getRoomsUrl, JSON.stringify(hostId), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  bookRoom(data) {
    return this.http.post(bookRoomUrl, JSON.stringify(data), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  getReviews(roomId) {
    const data = {
      apartment_id: roomId
    }
    return this.http.post(getReviewsUrl, JSON.stringify(data), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  updateRoom(data) {
    return this.http.post(updateRoomUrl, JSON.stringify(data), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  getImagePath() {
    return serverUrl.concat('/apartment_img/');
  }

  getReservations(data) {
    return this.http.post(getReservationsUrl, JSON.stringify(data), {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  uploadImage(files, room_id) {
    const formData = new FormData();
    formData.append('file', files[0], files[0].name);
    formData.append('id', room_id);
    formData.append('host', localStorage.getItem('id'));
    return this.http.post(uploadImageUrl, formData);
  }

  uploadImages(files, room_id) {
    const formData = new FormData();
    for (const file in files) {
      if (Object.prototype.hasOwnProperty.call(files, file)) {
        formData.append('file', files[file], files[file].name);
      }
    }
    formData.append('id', room_id);
    formData.append('host', localStorage.getItem('id'));
    return this.http.post(uploadImagesUrl, formData);
  }

  removeImages(images: string[], clickedImages: boolean[], room_id: string) {
    interface myImage {
      file: string
    }
    let myRegEx = room_id.concat('/');
    const listOfJson: myImage[] = [];
    for (const image in clickedImages) {
      if (Object.prototype.hasOwnProperty.call(clickedImages, image)) {
        if (clickedImages[image]) {
          let temp: myImage = {
            file: ''
          }
          temp.file = images[image].substr(images[image].search(myRegEx)+room_id.length+1);
          console.log(temp.file);
          listOfJson.push(temp);
        }
      }
    }
    const data = {
      id: room_id,
      host: localStorage.getItem('id'),
      files: listOfJson
    }
    console.log(data);
    return this.http.post(removeImagesUrl, JSON.stringify(data), {headers: new HttpHeaders().set('Content-Type', 'application/json')});    
  }

  getServerUrl() {
    return serverUrl;
  }
}
