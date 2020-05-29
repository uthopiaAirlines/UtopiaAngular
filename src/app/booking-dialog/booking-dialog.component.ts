import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { Booking } from '../domain/booking'
import { NgModel } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
import { BookingService } from '../service/booking/booking-service.service';
import { claims } from '../domain/oauthTokenClaims';

@Component({
  selector: 'app-booking-dialog',
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.css']
})
export class BookingDialogComponent implements OnInit {

  userRole: string;
  clients: any[];
  user: claims;
  maxTickets: number;

  constructor(
    public dialogRef: MatDialogRef<BookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public booking: Booking,
    public oauthService: OAuthService,
    private bookingServ: BookingService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.oauthService.hasValidAccessToken()) {
      this.userRole = this.oauthService.getIdentityClaims()["cognito:groups"][0];
      this.user = this.oauthService.getIdentityClaims();
      switch (this.userRole) {
        case "Agent":
          this.getClientsOfAgent(this.user.sub);
          break;
        case "Customer":
          this.booking.patron = this.user.sub;
          break;
        case "Counter":
          this.getUsersForCounter();
          break;
      }
    }
    this.maxTickets = this.booking.numberOfTickets;
    this.booking.numberOfTickets = 1;
  }

  isValid(patron: NgModel, numberOfTickets: NgModel) {
    if (this.userRole != 'Customer')
      return patron.valid && numberOfTickets.valid;
    else
      return numberOfTickets.valid;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getClientsOfAgent(agentId: string) {
    this.bookingServ.getClientByAgent(agentId).subscribe(res => {
      this.clients = res;
    },
      err => {
        this.dialog.open(ErrorDialogComponent);
      })
  }

  getUsersForCounter() {
    this.bookingServ.getUserCounter().subscribe(res => {
      this.clients = res
    },
      err => {
        this.dialog.open(ErrorDialogComponent);
      }
    )
  }

}
