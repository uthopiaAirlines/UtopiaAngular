import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedBookingComponent } from './selected-booking.component';

describe('SelectedBookingComponent', () => {
  let component: SelectedBookingComponent;
  let fixture: ComponentFixture<SelectedBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
