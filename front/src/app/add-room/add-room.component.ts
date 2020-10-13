import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { RoomService } from '../room.service';
import { UserService } from '../user.service';

import * as L from 'leaflet';

interface Type {
  value: string,
  viewValue: string
}

interface Response {
  success: string,
  id:      number
}

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {

  apikey = "AIzaSyAD2VfuB9h0d1IpF8JP7UWefzaWrCnKaiA";
  formattedAddress: string = '';
  options = {
    componentRestrictions: {
      country: ['GR']
    }
  }

  addRoomForm;

  mymap = null;
  minStart = new Date();
  maxEnd   = new Date(this.minStart.getFullYear(), this.minStart.getMonth()+1);
  start;
  end;
  types: Type[] = [
    {value: 'Apartment', viewValue: 'Apartment'},
    {value: 'Corporate Apartment', viewValue: 'Corporate Apartment'},
    {value: 'Guest House', viewValue: 'Guest House'},
  ];

  showMap: boolean = false;
  showPart2: boolean = false;
  showPart3: boolean = false;
  showPart4: boolean = false;
  showSuccess: boolean = false;
  showFailure: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    public service: RoomService,
    public userService: UserService,
    private router: Router,
  ) {
    this.addRoomForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      latitude: new FormControl('', [Validators.required, Validators.pattern('[-]*[1-9][0-9]*.[0-9]*')]),
      longitude: new FormControl('', [Validators.required, Validators.pattern('[-]*[1-9][0-9]*.[0-9]*')]),
      city: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      bedrooms: new FormControl('', [Validators.required, Validators.min(0)]),
      beds: new FormControl('', [Validators.required, Validators.min(0)]),
      bathrooms: new FormControl('', [Validators.required, Validators.min(0)]),
      kitchens: new FormControl('', [Validators.required, Validators.min(0)]),
      smoking: new FormControl('', [Validators.required]),
      pets: new FormControl('', [Validators.required]),
      tv: new FormControl('', [Validators.required]),
      wifi: new FormControl('', [Validators.required]),
      airCondition: new FormControl('', [Validators.required]),
      elevator: new FormControl('', [Validators.required]),
      parking: new FormControl('', [Validators.required]),
      start: new FormControl(this.minStart, [Validators.required]),
      end: new FormControl(this.maxEnd, [Validators.required]),
      minDays: new FormControl('', [Validators.required, Validators.min(1)]),
      costPerNight: new FormControl('', [Validators.required, Validators.min(1)]),
      type: new FormControl('', [Validators.required]),
      guests: new FormControl('', [Validators.required, Validators.min(1)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      user_id: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      images: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('isLoggedIn') == null) {
      this.router.navigate(['']);
    }
  }

  dateFilter: (date: Date | null) => boolean = (date: Date | null) => {
    return date > this.addRoomForm.get('start').value;
  }

  handleAddressChange(address: any) {
    this.formattedAddress = address.formatted_address;
    this.addRoomForm.controls.latitude.setValue(address.geometry.location.lat());
    this.addRoomForm.controls.longitude.setValue(address.geometry.location.lng());
    this.addRoomForm.controls.address.setValue(''.concat(address.address_components[1].long_name, ' ', address.address_components[0].long_name));
    this.addRoomForm.controls.city.setValue(address.address_components[2].long_name);
    this.addRoomForm.controls.region.setValue(address.address_components[4].long_name);
    this.addMap();
  }

  onSubmit(roomData) {
    const updatedRoomData = this.getUpdatedRoomData(roomData);
    this.service.addRoom(updatedRoomData).subscribe(
      (res: Response) => {
        if (res.success == 'true') {
          this.onUpload(res.id);
        }
        else {
          this.showFailure = true;
        }
      }
    )
  }

  getUpdatedRoomData(roomData) {
    const data = {
      name: roomData.name,
      latitude: roomData.latitude,
      longitude: roomData.longitude,
      city: roomData.city,
      region: roomData.region,
      address: roomData.address,
      bedrooms: roomData.bedrooms,
      beds: roomData.beds,
      bathrooms: roomData.bathrooms,
      kitchens: roomData.kitchens,
      minDays: roomData.minDays,
      costPerNight: roomData.costPerNight,
      type: roomData.type,
      guests: roomData.guests,
      description: roomData.description,
      user_id: localStorage.getItem('id'),
      smoking: this.addRoomForm.get('smoking').value === true ? 1 : 0,
      pets: this.addRoomForm.get('pets').value === true ? 1 : 0,
      tv: this.addRoomForm.get('tv').value === true ? 1 : 0,
      wifi: this.addRoomForm.get('wifi').value === true ? 1 : 0,
      airCondition: this.addRoomForm.get('airCondition').value === true ? 1 : 0,
      elevator: this.addRoomForm.get('elevator').value === true ? 1 : 0,
      parking: this.addRoomForm.get('parking').value === true ? 1 : 0,
      start: this.datePipe.transform(this.start, "yyyy-MM-dd"),
      end:  this.datePipe.transform(this.end, "yyyy-MM-dd")
    }
    return data;
  }

  @ViewChild('fileInput') fileInput;
  onUpload(room_id) {
    const files: FileList = this.fileInput.nativeElement.files;
    this.service.uploadImage(files, room_id).subscribe(
      res => {
        this.onUpload2(room_id);
      }
    )
  }

  @ViewChild('fileInput2') fileInput2;
  onUpload2(room_id) {
    const files: FileList = this.fileInput2.nativeElement.files;
    this.service.uploadImages(files, room_id).subscribe(
      res => {
        console.log(res)
        this.showSuccess = true;
      }
    )
  }

  addMap() {
    this.mymap = L.map('mapid').setView([this.addRoomForm.get('latitude').value, this.addRoomForm.get('longitude').value], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
    }).addTo(this.mymap);
  
    L.marker([this.addRoomForm.get('latitude').value, this.addRoomForm.get('longitude').value]).addTo(this.mymap);

    this.showMap = true;
  }

  goBackToPart1() {
    window.location.reload();
  }

  goBackToPart2() {
    this.showPart3 = false;
    this.showPart2 = true;
  }

  goBackToPart3() {
    this.showPart4 = false;
    this.showPart3 = true;
  }

  goToPart2() {
    this.showPart2  = true;
    this.showMap    = false;
    this.mymap.remove();
    document.getElementById('mapid').setAttribute('style','display:none');
  }

  goToPart3() {
    this.showPart2  = false;
    this.showPart3  = true;
  }

  goToPart4() {
    this.showPart3 = false;
    this.showPart4 = true;
  }

  closeSuccessModal() {
    this.showSuccess = false;
    this.addRoomForm.reset();
    // also change route to view my apartments.
    this.router.navigate(
      ['view-rooms']
    )
  }

  closeFailureModal() {
    this.showFailure = false;
  }

  getErrorMsgMinDays() {
    if (this.addRoomForm.get('minDays').hasError('required'))
      return 'This field is required.';
    if (this.addRoomForm.get('minDays').hasError('min'))
      return 'Please give a positive number.';
    return '';
  }

  getErrorMsgCPN() {
    if (this.addRoomForm.get('costPerNight').hasError('required'))
      return 'This field is required.';
    if (this.addRoomForm.get('costPerNight').hasError('min'))
      return 'Please give a positive number.';
    return '';
  }

  getErrorMsgMaxGuests() {
    if (this.addRoomForm.get('guests').hasError('required'))
      return 'This field is required.';
    if (this.addRoomForm.get('guests').hasError('min'))
      return 'Please give a positive number.';
    return '';
  }

  getErrorMsgDescription() {
    if (this.addRoomForm.get('description').hasError('maxlength'))    // wierd that maxLength have to be lowercase inside hasError function
      return 'Description cannot be over 100 characters.';
    if (this.addRoomForm.get('description').hasError('required'))
      return 'This field is required.';
    return '';
  }

  getErrorMsgBedrooms() {
    if (this.addRoomForm.get('bedrooms').hasError('required'))
      return 'This field is required.';
    if (this.addRoomForm.get('bedrooms').hasError('min'))
      return 'Please give a positive number.';
    return '';
  }

  getErrorMsgBeds() {
    if (this.addRoomForm.get('beds').hasError('required'))
      return 'This field is required.';
    if (this.addRoomForm.get('beds').hasError('min'))
      return 'Please give a positive number.';
    return '';
  }

  getErrorMsgBathrooms() {
    if (this.addRoomForm.get('bathrooms').hasError('required'))
      return 'This field is required.';
    if (this.addRoomForm.get('bathrooms').hasError('min'))
      return 'Please give a positive number.';
    return '';
  }

  getErrorMsgKitchens() {
    if (this.addRoomForm.get('kitchens').hasError('required'))
      return 'This field is required.';
    if (this.addRoomForm.get('kitchens').hasError('min'))
      return 'Please give a positive number.';
    return '';
  }

  getMsgSuccess() {
    return 'Congratulations. Your room has been added successfully.';
  }

  getMsgFailure() {
    return 'Oops! Something went wrong. Please try again.';
  }
}
