import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Flight } from '../../domain/flight'
import { environment } from '../../../environments/environment'
import { Booking } from 'src/app/domain/booking';
import { OAuthService } from 'angular-oauth2-oidc';
import { map } from 'rxjs/operators';

const url = environment.urls;

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private http: HttpClient, private oauthService: OAuthService) { }

  getFlights() {
    return this.http.get<Flight[]>(url.customer + '/flights').pipe(map((data) => {
      data.forEach((flight) => {
        flight.arrivalTime = new Date(flight.arrivalTime);
        flight.departureTime = new Date(flight.departureTime);
      });
      return data;
    }))
  }

  createPaymentIntent(totalCost) {
    let request = {
      amount: totalCost * 100
    };
    const header = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.post("https://fah37lk7nd.execute-api.us-east-1.amazonaws.com/stripe-payment-intent", request, { headers: header });
  }

  createBooking(booking: Booking) {
    booking.bookingAgent = this.oauthService.getIdentityClaims()["sub"];
    console.log(booking);
    let currentUrl: string;
    switch (this.oauthService.getIdentityClaims()["cognito:groups"][0]) {
      case "Agent":
        currentUrl = url.agent;
        break;
      case "Counter":
        currentUrl = url.counter;
        break;
      case "Customer":
        currentUrl = url.customer;
        break;
      default:
        break;
    }
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    console.log(headers);
    return this.http.post<Booking>(currentUrl + '/bookings', booking, { headers: headers });
  }
}
