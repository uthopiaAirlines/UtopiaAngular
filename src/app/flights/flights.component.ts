import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { FlightsDataSource } from './flights-datasource';
import { Flight } from '../domain/flight';
import { Booking } from '../domain/booking';
import { intentResponse } from '../domain/intentResponse';
import { FlightService } from '../service/flight/flight.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';
import { PaymentInformationDialogComponent } from '../payment-information-dialog/payment-information-dialog.component';
import { OAuthService } from 'angular-oauth2-oidc';

declare const Stripe;

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Flight>;
  dataSource: FlightsDataSource;
  userRole: string;

  stripe;


  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['flightId', 'airline', 'arrivalTime', 'arrivalLocation', 'departureTime', 'departureLocation', 'availableSeats', 'price'];

  constructor(private flightService: FlightService, public dialog: MatDialog, public oauthService: OAuthService) { }

  ngOnInit() {
    this.stripe = Stripe('pk_test_X0Qd8APxhX2bwh3MvKMEEpgV00h4pRawT3');

    this.dataSource = new FlightsDataSource(this.flightService);
    if (this.oauthService.hasValidAccessToken()) {
      this.userRole = this.oauthService.getIdentityClaims()["cognito:groups"][0];
    }
  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter(filterValue.trim().toLowerCase());
  }

  openDialog(row): void {
    if (!this.oauthService.hasValidAccessToken()) return;
    let booking: Booking = { flight: row.flightId, ticketPrice: row.price, bookingId: 0 }
    const dialogRef = this.dialog.open(BookingDialogComponent, {
      data: { ...booking }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log(res);
        let bookingReq: Booking = res;
        let totalCost = bookingReq.numberOfTickets * bookingReq.ticketPrice;

        //get paymentIntent object
        this.flightService.createPaymentIntent(totalCost.toFixed(2)).subscribe(
          res => {
            let intentRes: intentResponse = res;
            this.dialog.open(PaymentInformationDialogComponent,
              { width: '50%', data: { stripe: this.stripe, client: intentRes.client_secret, booking: bookingReq } })
              .afterClosed().subscribe(res => {
                console.log(res);
                this.table.renderRows();
                if (res) {

                }
              })
          },
          err => {

          })
      }
    })
  }

  dateFormated(date) {
    return new Date(date);
  }

}
