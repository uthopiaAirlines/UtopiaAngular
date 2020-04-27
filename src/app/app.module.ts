import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StorageServiceModule } from 'angular-webstorage-service';
import { MatDialogModule } from '@angular/material/dialog'

import { AppComponent } from './app.component';
import { BookingsComponent } from './bookings/bookings.component';
import { SelectedBookingComponent, DeletionConfirmation } from './bookings/selected-booking/selected-booking.component';

import { BookingService } from './services/booking-service.service';


@NgModule({
  declarations: [
    AppComponent,
    BookingsComponent,
    SelectedBookingComponent,
    DeletionConfirmation
  ],
  entryComponents: [DeletionConfirmation],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HttpClientModule,
    StorageServiceModule,
    MatDialogModule
  ],
  providers: [BookingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
