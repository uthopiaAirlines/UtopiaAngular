import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlightService } from '../service/flight/flight.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { LoaderOverlayComponent } from '../loader-overlay/loader-overlay.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-information-dialog',
  templateUrl: './payment-information-dialog.component.html',
  styleUrls: ['./payment-information-dialog.component.css']
})
export class PaymentInformationDialogComponent implements OnInit {
  // stripe;
  elements;
  style = {
    base: {
      color: "#32325d",
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#32325d"
      }
    },
    invalid: {
      fontFamily: 'Arial, sans-serif',
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };
  card;
  overlayRef;

  constructor(private router: Router, private flightService: FlightService, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data, private overlay: Overlay) { }

  ngOnInit(): void {
    // this.stripe = Stripe('pk_test_X0Qd8APxhX2bwh3MvKMEEpgV00h4pRawT3');
    this.elements = this.data.stripe.elements();
    this.card = this.elements.create("card", { style: this.style });
    // Stripe injects an iframe into the DOM
    this.card.mount("#card-element");
  }

  onSubmit() {
    this.showOverlay()
    this.data.stripe.confirmCardPayment(this.data.client, { payment_method: { card: this.card } }).then(
      res => {
        if (!res.hasOwnProperty('error')) {
          let confirmation = res;
          this.data.booking.paymentId = confirmation.paymentIntent.id;
          this.flightService.createBooking(this.data.booking).subscribe(() => {
            this.dialog.closeAll();
            this.closeOverlay();
            this.router.navigateByUrl('/bookings')
          },
            err => {
              this.closeOverlay();
              this.dialog.closeAll();
              this.dialog.open(ErrorDialogComponent);
              ////CREATE AN ERROR REFUND FUNCTION OR A CALLBACK TO TRY BOOKING AGAIN
              // this.data.stripe.refunds.create({ payment_intent: this.data.booking.paymentId })
              //   .then(() => {
              //     this.dialog.closeAll();
              //     this.dialog.open(ErrorDialogComponent);
              //   })
            }
          )
        }
        else {
          this.closeOverlay();
          this.dialog.closeAll();
          this.dialog.open(ErrorDialogComponent);
        }
      }
    ).catch(() => {
      this.closeOverlay();
      this.dialog.closeAll();
      this.dialog.open(ErrorDialogComponent);
    })
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
