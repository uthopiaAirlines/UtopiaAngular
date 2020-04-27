import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { BookingsComponent } from './bookings/bookings.component';
import { SelectedBookingComponent } from './bookings/selected-booking/selected-booking.component'


const routes: Routes = [
  {
    path: '',
    redirectTo: 'bookings',
    pathMatch: 'full'
  },
  {
    path: 'bookings',
    component: BookingsComponent,
    children: []
  },
  {
    path: 'selectedBooking',
    component: SelectedBookingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
