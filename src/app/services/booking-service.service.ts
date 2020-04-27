import { Injectable, Inject } from '@angular/core';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  selectedBooking = {};

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, private http: HttpClient) {
    this.selectedBooking = JSON.parse(storage.get('selectedBooking'));
  }

  getSelected() {
    return this.selectedBooking;
  }
  setSelected(booking) {
    this.selectedBooking = booking;
    this.storage.set('selectedBooking', JSON.stringify(booking));
  }

  deleteBooking(booking) {
    return this.http.delete(`http://localhost:3000/online/1.0.0/bookings/${booking.bookingId}`);
  }

  getBookingsByUser(userId) {
    return this.http.get<[]>(`http://localhost:3000/online/1.0.0/users/${userId}/bookings`);
  }
}
