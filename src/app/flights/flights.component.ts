import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { FlightsDataSource} from './flights-datasource';
import { Flight } from '../domain/flight'
import { Booking } from '../domain/booking'
import { FlightService } from '../service/flight/flight.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component'

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

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['flightId', 'airline', 'arrivalTime', 'arrivalLocation', 'departureTime', 'departureLocation', 'availableSeats', 'price'];

  constructor(private flightService: FlightService, public dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource = new FlightsDataSource(this.flightService);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  openDialog(row): void {
    // let booking: Booking = {
    //   flight: row.flightId,
    //   patron: "",
    //   bookingAgent: "",
    //   bookingId: 0,
    //   numberOfTickets: 0,
    //   ticketPrice: 0
    // };
    let booking: Booking = {flight: row.flightId, ticketPrice: row.price}
    const dialogRef = this.dialog.open(BookingDialogComponent, {
      data: {...booking}
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.flightService.createBooking(res).subscribe(() => {
          this.table.renderRows();
        })
      }
    })
  }
}
