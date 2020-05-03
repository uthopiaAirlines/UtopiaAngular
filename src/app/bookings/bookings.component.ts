import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { claims } from '../domain/oauthTokenClaims';
import { BookingService } from '../service/booking/booking-service.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  displayedColumns: string[] = ["airline", "departureLocation", "departureTime", "arrivalLocation", "arrivalTime", "price", "numberOfTickets"];
  dataSource;
  clients: any[];
  selectedClient;
  userRole;
  loading = false;

  constructor(private _router: Router, private bookingServ: BookingService, private oauthService: OAuthService, private dialog: MatDialog) { };

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    this.loading = true;

    //get the claims of user
    let user: claims = this.oauthService.getIdentityClaims();
    this.userRole = user["cognito:groups"][0];

    //different booking actions per role
    if (this.userRole == "Customer") {
      this.getBookingsBySub(user.sub);
    }

    else if (this.userRole == "Agent") {
      this.getClientsOfAgent(user.sub);
    }

    else if (this.userRole == "Counter") {
      this.getAllUsers();
    }

  };

  //For Counter
  getAllUsers() {
    this.loading = true;
    this.bookingServ.getUserCounter().subscribe(res => {
      this.clients = res;
      this.loading = false;
    },
      err => {
        this.dialog.open(ErrorDialogComponent);
        this.loading = false;
      })
  }

  getBookingsOfUser(clientId) {
    this.loading = true;
    this.bookingServ.getUsersBookingsCounter(clientId).subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    },
      err => {
        this.dialog.open(ErrorDialogComponent);
        this.loading = false;
      })
  }

  //For Agents
  getClientsOfAgent(agentId) {
    this.loading = true;
    this.bookingServ.getClientByAgent(agentId).subscribe(res => {
      this.clients = res;
      this.loading = false;
    },
      err => {
        this.dialog.open(ErrorDialogComponent);
        this.loading = false;
      })
  }


  getBookingsOfClient(clientId) {
    this.loading = true;
    this.bookingServ.getClientsBookings(clientId).subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    },
      err => {
        this.dialog.open(ErrorDialogComponent);
        this.loading = false;
      })
  }

  //For Customers
  getBookingsBySub(sub) {
    this.loading = true;
    this.bookingServ.getBookingsByUserCustomer(sub).subscribe(flights => {
      this.dataSource = new MatTableDataSource(flights);
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    },
      err => {
        this.dialog.open(ErrorDialogComponent);
        this.loading = false;
      });

  };

  //For Everyone
  selectRow(row) {
    this.bookingServ.setSelected(row);
    this._router.navigateByUrl('selectedBooking')
  }

  dateFormated(date) {
    return new Date(date).toLocaleString();
  }

}
