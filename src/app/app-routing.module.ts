import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { FlightsComponent } from './flights/flights.component';
import { BookingsComponent } from './bookings/bookings.component';
import { SelectedBookingComponent } from './bookings/selected-booking/selected-booking.component';

import { AuthGuardService } from './service/authGuard/auth-guard.service'


const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "home" },
  { path: "home", component: HomeComponent },
  { path: "flights", component: FlightsComponent },
  {
    path: 'bookings',
    component: BookingsComponent,
    children: [],
    canActivate: [AuthGuardService]
  },
  {
    path: 'selectedBooking',
    component: SelectedBookingComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
