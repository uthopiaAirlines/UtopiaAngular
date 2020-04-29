import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StorageServiceModule } from 'angular-webstorage-service';
import { MatDialogModule } from '@angular/material/dialog'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';


import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BookingsComponent } from './bookings/bookings.component';
import { SelectedBookingComponent, DeletionConfirmation } from './bookings/selected-booking/selected-booking.component';

import { BookingService } from './services/booking-service.service';
import { AuthGuardService } from './service/authGuard/auth-guard.service'

import { FlightsComponent } from './flights/flights.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { FlightService } from './service/flight/flight.service';
import { BookingDialogComponent } from './booking-dialog/booking-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { OAuthModule } from 'angular-oauth2-oidc';
import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    BookingsComponent,
    SelectedBookingComponent,
    DeletionConfirmation,
    FlightsComponent,
    HomeComponent,
    HeaderComponent,
    BookingDialogComponent,
    PageNotFoundComponent
  ],
  entryComponents: [DeletionConfirmation, BookingDialogComponent],
  imports: [
    BrowserModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    AppRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HttpClientModule,
    StorageServiceModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatProgressBarModule,
    OAuthModule.forRoot()
  ],
  providers: [
    FlightService,
    BookingService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
