import { Injectable, Inject } from '@angular/core';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment'
import { OAuthService } from 'angular-oauth2-oidc';

const url = environment.urls;

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  selectedBooking = {};

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, private http: HttpClient, private oauthService: OAuthService) {
    this.selectedBooking = JSON.parse(storage.get('selectedBooking'));
  }

  getSelected() {
    return this.selectedBooking;
  }
  setSelected(booking) {
    this.selectedBooking = booking;
    this.storage.set('selectedBooking', JSON.stringify(booking));
  }

  //Hits the Customer Api
  deleteBookingCustomer(booking) {
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.delete(url.customer + `/bookings/${booking.bookingId}`, { headers: headers });
  }

  getBookingsByUserCustomer(userId) {
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.get<[]>(url.customer + `/users/${userId}/bookings`, { headers: headers });
  }


  //Hits The Agent Api
  getClientByAgent(agentId) {
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.get<[]>(url.agent + `/agents/${agentId}/clients`, { headers: headers })
  }

  deleteBookingClient(booking) {
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.delete(url.agent + `/bookings/${booking.bookingId}`, { headers: headers });
  }

  getClientsBookings(clientId) {
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.get<[]>(url.agent + `/users/${clientId}/bookings`, { headers: headers })
  }

  //Hits the Counter Api
  getUserCounter() {
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.get<[]>(url.counter + `/users/`, { headers: headers })
  }

  deleteBookingCounter(booking) {
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.delete(url.counter + `/bookings/${booking.bookingId}`, { headers: headers });
  }

  getUsersBookingsCounter(userId) {
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.get<[]>(url.counter + `/users/${userId}/bookings`, { headers: headers })
  }
}
