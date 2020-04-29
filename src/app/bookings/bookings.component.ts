import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { claims } from '../domain/oauthTokenClaims';
import { BookingService } from '../services/booking-service.service';
import { OAuthService } from 'angular-oauth2-oidc';


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

  constructor(private _router: Router, private bookingServ: BookingService, private oauthService: OAuthService) { };

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    this.loading = true;

    //get the claims of user
    let user: claims;
    if (this.oauthService.hasValidAccessToken()) {
      user = this.oauthService.getIdentityClaims();
      this.userRole = user["cognito:groups"][0];
    } else {
      this._router.navigateByUrl('home');
    }

    //different booking actions per role
    if (this.userRole == "Customer") {
      this.getBookingsBySub(user.sub);
    }

    else if (this.userRole == "Agent") {
      this.getClientsOfAgent(user.sub);
    }

    else if (this.userRole == "Counter") {

    }

    this.loading = false;
  };

  //For Agents
  getClientsOfAgent(agentId) {
    this.bookingServ.getClientByAgent(agentId).subscribe(res => {
      this.clients = res;
    })
  }


  getBookingsOfClient(clientId) {
    this.bookingServ.getClientsBookings(clientId).subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
    })
  }

  //For Customers
  getBookingsBySub(sub) {
    this.bookingServ.getBookingsByUserCustomer(sub).subscribe(flights => {
      this.dataSource = new MatTableDataSource(flights);
      this.dataSource.paginator = this.paginator;
    });
  };

  //For Everyone
  selectRow(row) {
    this.bookingServ.setSelected(row);
    this._router.navigateByUrl('selectedBooking')
  }

  dateFormated(date) {
    return new Date(date);
  }

}
