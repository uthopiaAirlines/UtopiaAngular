import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Flight } from '../../domain/flight'
import { environment } from '../../../environments/environment'
import { Booking } from 'src/app/domain/booking';
import { OAuthService } from 'angular-oauth2-oidc';
import { map } from 'rxjs/operators';

const url = environment.urls.counter;

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private http: HttpClient, private oauthService: OAuthService) { }

  getFlights() {
    return this.http.get<Flight[]>(url + '/flights').pipe(map((data) => {
      data.forEach((flight) => {
        flight.arrivalTime = new Date(flight.arrivalTime);
        flight.departureTime = new Date(flight.departureTime);
      });
      return data;
    }))
  }

  createBooking(booking: Booking) {
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.post<Booking>(url + '/bookings', booking, {headers: headers});
  }
}
