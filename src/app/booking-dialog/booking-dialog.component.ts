import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Booking } from '../domain/booking'
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-booking-dialog',
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.css']
})
export class BookingDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<BookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public booking: Booking
  ) {}

  ngOnInit(): void {
  }

  isValid(patron: NgModel, numberOfTickets: NgModel, bookingAgent: NgModel) {
    return patron.valid && numberOfTickets.valid && bookingAgent.valid;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
