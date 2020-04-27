import { Component, OnInit } from '@angular/core';
import { Injectable, Inject } from '@angular/core';
import { BookingService } from '../../services/booking-service.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';



@Component({
  selector: 'app-selected-booking',
  templateUrl: './selected-booking.component.html',
  styleUrls: ['./selected-booking.component.css']
})
export class SelectedBookingComponent implements OnInit {

  constructor(private bookingServ: BookingService, private dialog: MatDialog) { }
  booking;

  ngOnInit(): void {
    this.booking = this.bookingServ.getSelected();
  }

  onClick() {
    this.dialog.open(DeletionConfirmation);
  }

}

@Component({
  selector: 'deletion-confirmation',
  templateUrl: 'deletion-confirmation.html'
})
export class DeletionConfirmation {
  constructor(private bookingServ: BookingService, private router: Router, private dialog: MatDialog) { }

  onClick() {
    let booking = this.bookingServ.getSelected();
    this.bookingServ.deleteBooking(booking).subscribe(result => {
      this.router.navigateByUrl('/bookings');
      this.dialog.closeAll();
    }
    );
  }
}