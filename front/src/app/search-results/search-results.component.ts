import { Component, OnInit, Inject } from '@angular/core';
// import { SearchComponent } from '../search/search.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Router, ActivatedRoute, Params, UrlTree, UrlSegmentGroup, PRIMARY_OUTLET } from '@angular/router';

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

interface basicSearchTerms {
  location: string;
  fromDate: string;
  toDate:   string;
  adults:   string;
  children: string;
  advanced: string;
}

let rooms: gridItem[] = [];

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  url = '';
  tree: UrlTree;
  fragment = '';
  queryParams = {};
  // primary outlet
  primary: UrlSegmentGroup;
  // secondary outlet
  // sidebar: UrlSegmentGroup;

  searchTerms: basicSearchTerms = {
    location: '',
    fromDate: '',
    toDate: '',
    adults: '',
    children: '',
    advanced: ''
  };

  wifi: boolean;
  airCondition: boolean;
  kitchen: boolean;
  tv: boolean;
  parking: boolean;
  elevator: boolean;
  apartment: boolean;
  corporateApartment: boolean;
  guestHouse: boolean;
  minValue: number;
  maxValue: number;

  filters: number = 0;

  results: gridItem[] = rooms;

  allResults: gridItem[] = rooms;

  itemsPerPage: number = 10;

  length: number;

  constructor(
    // private searchComponent: SearchComponent,
    private filterDialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public service: SearchService,
  ) { }

  // TODO: Do query (get request with httpclientmodule)
  ngOnInit(): void {
    this.parseUrl();
    this.updateFilters();
  }

  openDialog() {
    this.filterDialog.open(FilterDialogComponent, {
      data: {}
    });
  }

  hasWifi(element: gridItem, index: number, array: gridItem[]): boolean {
    return element.wifi;
  }

  hasAC(element: gridItem, index: number, array: gridItem[]): boolean {
    return element.airCondition;
  }

  hasKitchen(element: gridItem, index: number, array: gridItem[]): boolean {
    return element.kitchens;
  }

  hasTV(element: gridItem, index: number, array: gridItem[]): boolean {
    return element.tv;
  }

  hasParking(element: gridItem, index: number, array: gridItem[]): boolean {
    return element.parking;
  }

  hasElevator(element: gridItem, index: number, array: gridItem[]): boolean {
    return element.elevator;
  }

  isApartment(element: gridItem, index: number, array: gridItem[]): boolean {
    return (element.type == houseType.apartment) ? true : false;
  }

  isCorporateApartment(element: gridItem, index: number, array: gridItem[]): boolean {
    return (element.type == houseType.corporate_apartment) ? true : false;
  }

  isGuestHouse(element: gridItem, index: number, array: gridItem[]): boolean {
    return (element.type == houseType.guest_house) ? true : false;
  }

  parseUrl(): void {

    this.route.url.subscribe(
      url => {
        this.url = url.toString();
        this.tree = this.router.parseUrl(window.location.pathname);
        this.fragment = this.tree.fragment;
        this.queryParams = this.tree.queryParams;
        this.primary = this.tree.root.children[PRIMARY_OUTLET];

        this.searchTerms.location = this.primary.segments[1].toString();
        this.searchTerms.fromDate = this.primary.segments[2].toString();
        this.searchTerms.toDate   = this.primary.segments[3].toString();
        this.searchTerms.adults   = this.primary.segments[4].toString();
        this.searchTerms.children = this.primary.segments[5].toString();
        this.searchTerms.advanced = this.primary.segments[6].toString();

        // Now that searchTerms is filled up; do the request
        this.service.search(this.searchTerms).subscribe(
          res => {
            this.results = [];
            this.allResults = [];
            for (const item in res) {
              if (Object.prototype.hasOwnProperty.call(res, item)) {
                const element = res[item];
                // console.log(element);
                element.image = this.service.getImagePath().concat(element.id,'/',element.image);
                this.allResults.push(element);
              }
            }
            // Sort results before show them
            // this.allResults.sort(function(a, b){return a.costPerNight-b.costPerNight;});
            for (const key in this.allResults) {
              if (Object.prototype.hasOwnProperty.call(this.allResults, key)) {
                if (parseInt(key) < this.itemsPerPage)
                  this.results.push(this.allResults[key]);              
              }
            }
            // this.results.sort(function(a, b){return a.costPerNight-b.costPerNight;});
            this.length = this.allResults.length;
            this.service.setRooms(this.allResults);
          }
        );

      }
    )
  }

  updateFilters(): void {

    this.route.queryParams.subscribe(
      params => {
        this.filters = 0;
        let filteredOnce: boolean = false;
        this.wifi = (params['wifi'] == 'true');
        this.airCondition = (params['airCondition'] == 'true');
        this.kitchen = (params['kitchen'] == 'true');
        this.tv = (params['tv'] == 'true');
        this.parking = (params['parking'] == 'true');
        this.elevator = (params['elevator'] == 'true');
        this.apartment = (params['apartment'] == 'true');
        this.corporateApartment = (params['corporateApartment'] == 'true');
        this.guestHouse = (params['guestHouse'] == 'true');
        if (params['minValue'])
          this.minValue = +params['minValue'];
        if (params['maxValue'])
          this.maxValue = +params['maxValue'];

        if (this.wifi === true) {
          this.results = this.allResults.filter(this.hasWifi);
          filteredOnce = true;
          this.filters++;
        }

        if (this.airCondition === true && !filteredOnce) {
          this.results = this.allResults.filter(this.hasAC);
          filteredOnce = true;
          this.filters++;
        }
        else if (this.airCondition === true && filteredOnce) {
          this.results = this.results.filter(this.hasAC);
          this.filters++;
        }

        if (this.kitchen === true && !filteredOnce) {
          this.results = this.allResults.filter(this.hasKitchen);
          filteredOnce = true;
          this.filters++;
        }
        else if (this.kitchen === true && filteredOnce) {
          this.results = this.results.filter(this.hasKitchen);
          this.filters++;
        }

        if (this.tv === true && !filteredOnce) {
          this.results = this.allResults.filter(this.hasTV);
          filteredOnce = true;
          this.filters++;
        }
        else if (this.tv === true && filteredOnce) {
          this.results = this.results.filter(this.hasTV);
          this.filters++;
        }

        if (this.parking === true && !filteredOnce) {
          this.results = this.allResults.filter(this.hasParking);
          filteredOnce = true;
          this.filters++;
        }
        else if (this.parking === true && filteredOnce) {
          this.results = this.results.filter(this.hasParking);
          this.filters++;
        }

        if (this.elevator === true && !filteredOnce) {
          this.results = this.allResults.filter(this.hasElevator);
          filteredOnce = true;
          this.filters++;
        }
        else if (this.elevator === true && filteredOnce) {
          this.results = this.results.filter(this.hasElevator);
          this.filters++;
        }

        if (this.apartment === true && !filteredOnce) {
          this.results = this.allResults.filter(this.isApartment);
          filteredOnce = true;
          this.filters++;
        }
        else if (this.apartment === true && filteredOnce) {
          this.results = this.results.filter(this.isApartment);
          this.filters++;
        }

        if (this.corporateApartment === true && !filteredOnce) {
          this.results = this.allResults.filter(this.isCorporateApartment);
          filteredOnce = true;
          this.filters++;
        }
        else if (this.corporateApartment === true && filteredOnce) {
          this.results = this.results.filter(this.isCorporateApartment);
          this.filters++;
        }

        if (this.guestHouse === true && !filteredOnce) {
          this.results = this.allResults.filter(this.isGuestHouse);
          filteredOnce = true;
          this.filters++;
        }
        else if (this.guestHouse === true && filteredOnce) {
          this.results = this.results.filter(this.isGuestHouse);
          this.filters++;
        }

        if (this.minValue > 0 && !filteredOnce) {
          this.results = this.allResults.filter(room => room.costPerNight >= this.minValue);
          filteredOnce = true;
          this.filters++;
        }
        else if (this.minValue > 0 && filteredOnce) {
          this.results = this.results.filter(room => room.costPerNight >= this.minValue);
          this.filters++;
        }

        if (this.maxValue < 1000 && !filteredOnce) {
          this.results = this.allResults.filter(room => room.costPerNight <= this.maxValue);
          filteredOnce = true;
          this.filters++;
        }
        else if (this.maxValue < 1000 && filteredOnce) {
          this.results = this.results.filter(room => room.costPerNight <= this.maxValue);
          this.filters++;
        }

        if (this.filters > 0) {
          if (this.results.length > this.itemsPerPage) {
            let tempRooms: gridItem[] = [];
            for (let i = 0; i < this.itemsPerPage; ++i) {
              tempRooms.push(this.results[i]);
            }
            this.results = tempRooms;
          }
          this.length = this.results.length;
        }
        else {
          this.results = [];
          if (this.allResults.length > this.itemsPerPage) {
            for (let i = 0; i < this.itemsPerPage; ++i) {
              this.results.push(this.allResults[i]);
            }
          }
          else {
            this.results = this.allResults;
          }
          this.length = this.allResults.length;
        }
      }
    )
  
  }

  removeFilters(): void {
    // Remove query params
    this.length = this.allResults.length;
    this.results = [];
    for (let i = 0; i < this.itemsPerPage; ++i)
      this.results.push(this.allResults[i]);
    this.router.navigate(
      [], {
        relativeTo: this.route,
        queryParams: {}
      }
    )
  }

  goToRoom(id: number): void {
    this.router.navigate(
      ['room-detail'],{
        queryParams: {
          unitId: id,
          arrival: this.searchTerms.fromDate,
          departure: this.searchTerms.toDate,
          adultsCount: this.searchTerms.adults,
          childrenCount: this.searchTerms.children
        }
      }
    )
  }

  handlePage(event) {
    let newItems = this.itemsPerPage; 
    let counter  = 0;
    this.results = [];
    // Next page
    if (event.previousPageIndex < event.pageIndex) {
      if (((event.pageIndex + 1) * this.itemsPerPage) > this.allResults.length)
        newItems = newItems - (((event.pageIndex + 1) * this.itemsPerPage) - this.allResults.length);
      for (let i = (event.previousPageIndex + 1) * this.itemsPerPage; i < (event.pageIndex + 1) * this.itemsPerPage; ++i) {
        if (counter >= newItems)
          break;
        this.results.push(this.allResults[i]);
        console.log(counter, newItems, i);
        counter++;
      }
    }
    // Prev page
    else {
      for (let i = (event.pageIndex) * this.itemsPerPage; i < (event.previousPageIndex) * this.itemsPerPage; ++i) {
        if (counter > newItems)
          break;
        this.results.push(this.allResults[i]);
        counter++;
      }
    }
    console.log(event, this.results, this.results.length, counter)
  }
}

@Component({
  selector: 'filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.css']
})
export class FilterDialogComponent implements OnInit {
  minPrice = 0;
  maxPrice = 1000;

  minValue = 0;
  maxValue = 1000;

  wifi: boolean;
  airCondition: boolean;
  kitchen: boolean;
  tv: boolean;
  parking: boolean;
  elevator: boolean;
  apartment: boolean;
  corporateApartment: boolean;
  guestHouse: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.wifi = (params['wifi'] == 'true');
        this.airCondition = (params['airCondition'] == 'true');
        this.kitchen = (params['kitchen'] == 'true');
        this.tv = (params['tv'] == 'true');
        this.parking = (params['parking'] == 'true');
        this.elevator = (params['elevator'] == 'true');
        this.apartment = (params['apartment'] == 'true');
        this.corporateApartment = (params['corporateApartment'] == 'true');
        this.guestHouse = (params['guestHouse'] == 'true');
        if (params['minValue'])
          this.minValue = +params['minValue'];
        if (params['maxValue'])
          this.maxValue = +params['maxValue'];
      }
    )
  }

  applyFilters(): void {

    let params: Params = {};

    if (this.wifi === true)
      params.wifi = this.wifi;
    
    if (this.airCondition === true)
      params.airCondition = this.airCondition;
    
    if (this.kitchen === true)
      params.kitchen = this.kitchen;
    
    if (this.tv === true)
      params.tv = this.tv;
    
    if (this.parking === true)
      params.parking = this.parking;
    
    if (this.elevator === true)
      params.elevator = this.elevator;
    
    if (this.apartment === true)
      params.apartment = this.apartment;
    
    if (this.corporateApartment === true)
      params.corporateApartment = this.corporateApartment;
    
    if (this.guestHouse === true)
      params.guestHouse = this.guestHouse;
    
    if (this.minValue != 0)
      params.minValue = this.minValue;
    
    if (this.maxValue != 1000)
      params.maxValue = this.maxValue;

    this.router.navigate(
      [], {
        relativeTo: this.route,
        queryParams: params
      }
    )

  }
}