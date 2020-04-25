import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Flight } from '../../domain/flight'
import { environment } from '../../../environments/environment'
import { Booking } from 'src/app/domain/booking';

const url = environment.urls.counter;

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private http: HttpClient) { }

  getFlights() {
    return this.http.get<Flight[]>(url + '/flights')
  }

  createBooking(booking: Booking) {
    return this.http.post<Booking>(url + '/bookings', booking);
  }
}
