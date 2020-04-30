import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { FlightsDataSource } from './flights-datasource';
import { Flight } from '../domain/flight'
import { Booking } from '../domain/booking'
import { FlightService } from '../service/flight/flight.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component'
import { OAuthService } from 'angular-oauth2-oidc';

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

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['flightId', 'airline', 'arrivalTime', 'arrivalLocation', 'departureTime', 'departureLocation', 'availableSeats', 'price'];

  constructor(private flightService: FlightService, public dialog: MatDialog, public oauthService: OAuthService) { }

  ngOnInit() {
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
        this.flightService.createBooking(res).subscribe(() => {
          this.table.renderRows();
        })
      }
    })
  }

  dateFormated(date) {
    return new Date(date);
  }

}
