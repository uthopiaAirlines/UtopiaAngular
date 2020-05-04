import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../service/booking/booking-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { claims } from '../../domain/oauthTokenClaims';
import { ErrorDialogComponent } from '../../error-dialog/error-dialog.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay } from '@angular/cdk/overlay';
import { LoaderOverlayComponent } from '../../loader-overlay/loader-overlay.component';




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

  dateFormated(date) {
    return new Date(date).toLocaleString();
  }

}

@Component({
  selector: 'deletion-confirmation',
  templateUrl: './deletion-confirmation.html'
})
export class DeletionConfirmation implements OnInit {
  constructor(private overlay: Overlay, private bookingServ: BookingService, private router: Router, private dialog: MatDialog, private oauthService: OAuthService) { }

  userRole;
  overlayRef;

  ngOnInit(): void {
    let user: claims = this.oauthService.getIdentityClaims();
    this.userRole = user["cognito:groups"][0];
  }

  onClick() {
    this.showOverlay();
    let booking = this.bookingServ.getSelected();
    if (this.userRole == "Customer") {
      this.bookingServ.deleteBookingCustomer(booking).subscribe(result => {
        this.bookingServ.setSelected(null);
        this.router.navigateByUrl('/bookings');
        this.dialog.closeAll();
        this.closeOverlay();
      },
        err => {
          this.closeOverlay();
          this.dialog.open(ErrorDialogComponent);
        });
    }

    else if (this.userRole == "Agent") {
      this.bookingServ.deleteBookingClient(booking).subscribe(result => {
        this.bookingServ.setSelected(null);
        this.router.navigateByUrl('/bookings');
        this.dialog.closeAll();
        this.closeOverlay();
      },
        err => {
          this.dialog.open(ErrorDialogComponent);
          this.closeOverlay();
        });
    }

    else if (this.userRole == "Counter") {
      this.bookingServ.deleteBookingCounter(booking).subscribe(result => {
        this.bookingServ.setSelected(null);
        this.router.navigateByUrl('/bookings');
        this.dialog.closeAll();
        this.closeOverlay();
      }),
        err => {
          this.dialog.open(ErrorDialogComponent);
          this.closeOverlay();
        }
    };

  }

  showOverlay() {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true
    });
    this.overlayRef.attach(new ComponentPortal(LoaderOverlayComponent));
  }

  closeOverlay() {
    this.overlayRef.detach();
  }
}