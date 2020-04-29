import { Injectable, Inject } from '@angular/core';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';

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
    return this.http.delete(`http://localhost:3000/online/1.0.0/bookings/${booking.bookingId}`, { headers: headers });
  }

  getBookingsByUserCustomer(userId) {
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.get<[]>(`http://localhost:3000/online/1.0.0/users/${userId}/bookings`, { headers: headers });
  }


  //Hits The Agent Api
  getClientByAgent(agentId) {
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.get<[]>(`https://awl22d7v57.execute-api.us-east-1.amazonaws.com/production/agents/${agentId}/clients`, { headers: headers })
  }

  deleteBookingClient(booking) {
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.delete(`https://awl22d7v57.execute-api.us-east-1.amazonaws.com/production/bookings/${booking.bookingId}`, { headers: headers });
  }

  getClientsBookings(clientId) {
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.get<[]>(`https://awl22d7v57.execute-api.us-east-1.amazonaws.com/production/users/${clientId}/bookings`, { headers: headers })
  }
}
