import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { BookingService } from '../services/booking-service.service';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  displayedColumns: string[] = ["airline", "departureLocation", "departureTime", "arrivalLocation", "arrivalTime", "price", "numberOfTickets"];
  dataSource;


  constructor(private _router: Router, private bookingServ: BookingService, private http: HttpClient) { };

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    this.bookingServ.getBookingsByUser(5).subscribe(flights => {
      // console.log(flights);
      this.dataSource = new MatTableDataSource(flights);
      this.dataSource.paginator = this.paginator;
    });
  };

  getBookings() { }

  selectRow(row) {
    console.log(row);
    this.bookingServ.setSelected(row);
    this._router.navigateByUrl('selectedBooking')
  }

}
