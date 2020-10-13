import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAcceptedHostComponent } from './not-accepted-host.component';

describe('NotAcceptedHostComponent', () => {
  let component: NotAcceptedHostComponent;
  let fixture: ComponentFixture<NotAcceptedHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotAcceptedHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotAcceptedHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
