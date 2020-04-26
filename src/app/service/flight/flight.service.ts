import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Flight } from '../../domain/flight'
import { environment } from '../../../environments/environment'
import { Booking } from 'src/app/domain/booking';
import { OAuthService } from 'angular-oauth2-oidc';

const url = environment.urls.counter;

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private http: HttpClient, private oauthService: OAuthService) { }

  getFlights() {
    return this.http.get<Flight[]>(url + '/flights')
  }

  createBooking(booking: Booking) {
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.post<Booking>(url + '/bookings', booking, {headers: headers});
  }
}
