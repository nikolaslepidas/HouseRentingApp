import { Component, OnInit, ViewChild } from '@angular/core';
import { RoomService } from '../room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from '../user.service';
import { DatePipe } from '@angular/common';
import { SearchComponent } from '../search/search.component';
import { SearchService } from '../search.service';

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
  minDays:      number,
  guests:       number,
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

interface Type {
  value: string,
  viewValue: string
}

interface Response {
  success: string
}

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.css']
})
export class EditRoomComponent implements OnInit {

  editRoomForm;

  minStart = new Date();
  start;
  end;
  showPart2: boolean = false;
  showPart3: boolean = false;
  showPart4: boolean = false;
  showSuccess: boolean = false;
  showFailure: boolean = false;
  types: Type[] = [
    {value: 'Apartment', viewValue: 'Apartment'},
    {value: 'Corporate Apartment', viewValue: 'Corporate Apartment'},
    {value: 'Guest House', viewValue: 'Guest House'},
  ];
  
  mainImage: string;
  images: string[] = [];
  clickedImages: boolean[] = [];

  room: gridItem = {
    address:      '',
    airCondition: true,
    bathrooms:    0,
    bedrooms:     0,
    beds:         0,
    city:         '',
    costPerNight: 0,
    minDays:      0,
    guests:       0,
    elevator:     true,
    end:          new Date,
    host:         0,
    id:           0,
    image:        '',
    kitchens:     true,
    latitude:     '',
    longitude:    '',
    name:         '',
    parking:      true,
    pet:          true,
    rating:       0,
    region:       '',
    reviews:      0,
    smoking:      true,
    start:        new Date,
    tv:           true,
    type:         houseType.apartment,
    wifi:         true,
    description:  ''
  };

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    public roomService: RoomService,
    public userService: UserService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.editRoomForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      latitude: new FormControl('', [Validators.required, Validators.pattern('[1-9][0-9]*.[0-9]*')]),
      longitude: new FormControl('', [Validators.required, Validators.pattern('[1-9][0-9]*.[0-9]*')]),
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
      start: new FormControl(''),
      end: new FormControl(''),
      minDays: new FormControl('', [Validators.required, Validators.min(1)]),
      costPerNight: new FormControl('', [Validators.required, Validators.min(1)]),
      type: new FormControl('', [Validators.required]),
      guests: new FormControl('', [Validators.required, Validators.min(1)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      images: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('isLoggedIn') == null) {
      this.router.navigate(['']);
    }
    this.getRoom();
  }

  getImages() {
    this.searchService.searchImgs(this.room.id).subscribe(
      res => {
        this.images = [];
        for (const item in res) {
          if (Object.prototype.hasOwnProperty.call(res, item)) {
            if (res[item][0] === this.mainImage)
              continue;
            this.images.push(this.roomService.getServerUrl().concat('/apartment_img/',this.room.id.toString(),'/',res[item][0]));
            this.clickedImages.push(false);
          }
        }
        this.showPart2 = true;
      }
    )
  }

  clickedImage(index) {
    this.clickedImages[index] = !this.clickedImages[index];
  }

  onSubmit(newRoomData) {
    const updatedRoomData = this.getUpdatedRoomData(newRoomData);
    this.roomService.updateRoom(updatedRoomData).subscribe(
      (res: Response) => {
        if (res.success == 'true') {
          this.onUpload2(this.room.id.toString());
        }
        else {
          this.showFailure = true;
        }
      }
    )
  }

  getUpdatedRoomData(roomData) {
    const data = {
      id: this.room.id,
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
      smoking: this.editRoomForm.get('smoking').value === true ? 1 : 0,
      pets: this.editRoomForm.get('pets').value === true ? 1 : 0,
      tv: this.editRoomForm.get('tv').value === true ? 1 : 0,
      wifi: this.editRoomForm.get('wifi').value === true ? 1 : 0,
      airCondition: this.editRoomForm.get('airCondition').value === true ? 1 : 0,
      elevator: this.editRoomForm.get('elevator').value === true ? 1 : 0,
      parking: this.editRoomForm.get('parking').value === true ? 1 : 0,
      start: this.datePipe.transform(this.start, "yyyy-MM-dd"),        // dates are changing iconic only!!!!! todo!!!!
      end:  this.datePipe.transform(this.end, "yyyy-MM-dd")
    }
    return data;
  }

  @ViewChild('fileInput2') fileInput2;
  onUpload2(room_id: string) {
    const files: FileList = this.fileInput2.nativeElement.files;
    this.roomService.uploadImages(files, parseInt(room_id)).subscribe(
      (res: Response) => {
        if (res.success == 'true') {
          this.roomService.removeImages(this.images, this.clickedImages, room_id).subscribe(
            (res: Response) => {
              if (res.success == 'true')
                this.showSuccess = true;
              else
                this.showFailure = true;
            }
          )
        }
        else {
          this.showFailure = true;
        }
      }
    )
  }

  getRoom() {
    this.route.queryParamMap.subscribe(
      params => {
        this.room.id = parseInt(params.get('room_id'));
        this.roomService.getRooms().subscribe(
          res => {
            for (const item in res) {
              if (Object.prototype.hasOwnProperty.call(res, item)) {
                const element = res[item];
                element.image = this.roomService.getImagePath().concat(element.id,'/',element.image);
                if (element.id == this.room.id) {
                  this.room = element;
                  break;
                }
              }
            }
            this.editRoomForm.controls.costPerNight.setValue(this.room.costPerNight);
            this.editRoomForm.controls.minDays.setValue(this.room.minDays);
            this.editRoomForm.controls.guests.setValue(this.room.guests);
            this.editRoomForm.controls.name.setValue(this.room.name);
            this.editRoomForm.controls.type.setValue(this.room.type);
            this.editRoomForm.controls.description.setValue(this.room.description);
            this.editRoomForm.controls.bedrooms.setValue(this.room.bedrooms);
            this.editRoomForm.controls.beds.setValue(this.room.beds);
            this.editRoomForm.controls.bathrooms.setValue(this.room.bathrooms);
            this.editRoomForm.controls.kitchens.setValue(this.room.kitchens);
            this.editRoomForm.controls.smoking.setValue(this.room.smoking);
            this.editRoomForm.controls.pets.setValue(this.room.pet);
            this.editRoomForm.controls.tv.setValue(this.room.tv);
            this.editRoomForm.controls.wifi.setValue(this.room.wifi);
            this.editRoomForm.controls.elevator.setValue(this.room.elevator);
            this.editRoomForm.controls.airCondition.setValue(this.room.airCondition);
            this.editRoomForm.controls.parking.setValue(this.room.parking);
            this.editRoomForm.controls.latitude.setValue(this.room.latitude);
            this.editRoomForm.controls.longitude.setValue(this.room.longitude);
            this.editRoomForm.controls.city.setValue(this.room.city);
            this.editRoomForm.controls.region.setValue(this.room.region);
            this.editRoomForm.controls.address.setValue(this.room.address);
            this.start = this.room.start;
            this.end   = this.room.end;
            const firstSubStr = this.room.image.substr(this.room.image.search('/12')+1);
            this.mainImage = firstSubStr.substr(firstSubStr.search('/'.concat(this.room.id.toString(), '\.'))+1);
            this.getImages();
          }
        );
      }
    )
  }

  goBackToPart2() {
    this.showPart3 = false;
    this.showPart2 = true;
  }

  goBackToPart3() {
    this.showPart4 = false;
    this.showPart3 = true;
  }

  goToPart3() {
    this.showPart2  = false;
    this.showPart3  = true;
  }

  goToPart4() {
    this.showPart3 = false;
    this.showPart4 = true;
  }

  dateFilter: (date: Date | null) => boolean = (date: Date | null) => {
    return date > this.editRoomForm.get('start').value;
  }

  closeSuccessModal() {
    this.showSuccess = false;
    this.editRoomForm.reset();
    // also change route to view my apartments.
    this.router.navigate(
      ['view-rooms']
    )
  }

  closeFailureModal() {
    this.showFailure = false;
  }

  getErrorMsgMinDays() {
    if (this.editRoomForm.get('minDays').hasError('required'))
      return 'This field is required.';
    if (this.editRoomForm.get('minDays').hasError('min'))
      return 'Please give a positive number.';
    return '';
  }

  getErrorMsgCPN() {
    if (this.editRoomForm.get('costPerNight').hasError('required'))
      return 'This field is required.';
    if (this.editRoomForm.get('costPerNight').hasError('min'))
      return 'Please give a positive number.';
    return '';
  }

  getErrorMsgMaxGuests() {
    if (this.editRoomForm.get('guests').hasError('required'))
      return 'This field is required.';
    if (this.editRoomForm.get('guests').hasError('min'))
      return 'Please give a positive number.';
    return '';
  }

  getErrorMsgDescription() {
    if (this.editRoomForm.get('description').hasError('maxlength'))    // wierd that maxLength have to be lowercase inside hasError function
      return 'Description cannot be over 100 characters.';
    if (this.editRoomForm.get('description').hasError('required'))
      return 'This field is required.';
    return '';
  }

  getErrorMsgBedrooms() {
    if (this.editRoomForm.get('bedrooms').hasError('required'))
      return 'This field is required.';
    if (this.editRoomForm.get('bedrooms').hasError('min'))
      return 'Please give a positive number.';
    return '';
  }

  getErrorMsgBeds() {
    if (this.editRoomForm.get('beds').hasError('required'))
      return 'This field is required.';
    if (this.editRoomForm.get('beds').hasError('min'))
      return 'Please give a positive number.';
    return '';
  }

  getErrorMsgBathrooms() {
    if (this.editRoomForm.get('bathrooms').hasError('required'))
      return 'This field is required.';
    if (this.editRoomForm.get('bathrooms').hasError('min'))
      return 'Please give a positive number.';
    return '';
  }

  getErrorMsgKitchens() {
    if (this.editRoomForm.get('kitchens').hasError('required'))
      return 'This field is required.';
    if (this.editRoomForm.get('kitchens').hasError('min'))
      return 'Please give a positive number.';
    return '';
  }

  getMsgSuccess() {
    return 'Congratulations. Your room has been updated successfully.';
  }

  getMsgFailure() {
    return 'Oops! Something went wrong. Please try again.';
  }

}
