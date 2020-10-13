import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingMsgComponent } from './booking-msg.component';

describe('BookingMsgComponent', () => {
  let component: BookingMsgComponent;
  let fixture: ComponentFixture<BookingMsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingMsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
