import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-not-accepted-host',
  templateUrl: './not-accepted-host.component.html',
  styleUrls: ['./not-accepted-host.component.css']
})
export class NotAcceptedHostComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private headerComponent: HeaderComponent,
  ) {}

  ngOnInit(): void {
  }

  getRole() {
    return localStorage.getItem('role');
  }

  close() {
    this.headerComponent.service.logout();
  }

}

import { HeaderComponent } from '../header/header.component';