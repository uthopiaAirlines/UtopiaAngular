import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

//3rd Party Modules
import { StorageServiceModule } from 'angular-webstorage-service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppRoutingModule } from './app-routing.module';


//Material Modules
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { OverlayModule } from '@angular/cdk/overlay';


//Components
import { AppComponent } from './app.component';
import { BookingDialogComponent } from './booking-dialog/booking-dialog.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BookingsComponent } from './bookings/bookings.component';
import { FlightsComponent } from './flights/flights.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { SelectedBookingComponent, DeletionConfirmation } from './bookings/selected-booking/selected-booking.component';
import { AgentRegistrationComponent, RegistrationDialog, DeregistrationDialog } from './agent-registration/agent-registration.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';


//Custom Services
import { BookingService } from './service/booking/booking-service.service';
import { AuthGuardService } from './service/authGuard/auth-guard.service'
import { FlightService } from './service/flight/flight.service';
import { PaymentInformationDialogComponent } from './payment-information-dialog/payment-information-dialog.component';
import { LoaderOverlayComponent } from './loader-overlay/loader-overlay.component';


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
    PageNotFoundComponent,
    AgentRegistrationComponent,
    RegistrationDialog,
    DeregistrationDialog,
    ErrorDialogComponent,
    PaymentInformationDialogComponent,
    LoaderOverlayComponent
  ],
  entryComponents: [DeletionConfirmation, BookingDialogComponent, RegistrationDialog, DeregistrationDialog,
    LoaderOverlayComponent, ErrorDialogComponent, PaymentInformationDialogComponent],
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
    MatCardModule,
    MatProgressBarModule,
    OverlayModule,
    OAuthModule.forRoot(),
  ],
  providers: [
    FlightService,
    BookingService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
