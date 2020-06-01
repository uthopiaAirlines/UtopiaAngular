import { TestBed } from '@angular/core/testing';

import { FlightService } from './flight.service';
import { asyncData } from 'src/test/asyncData';
import { Flight } from '../../domain/flight';
import { intentResponse } from '../../domain/intentResponse';
import { Booking } from 'src/app/domain/booking';

describe('FlightService', () => {
  let service: FlightService;
  let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy };
  let oauthServiceSpy: { authorizationHeader: jasmine.Spy, getIdentityClaims: jasmine.Spy };

  beforeEach(() => {
    //TestBed.configureTestingModule({});
    //service = TestBed.inject(FlightService);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    oauthServiceSpy = jasmine.createSpyObj('OAuthService', ['authorizationHeader', 'getIdentityClaims'])
    service = new FlightService(<any>httpClientSpy, <any>oauthServiceSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return (client side paginated) flights', () => {
    const expectedJsonFlights = [
      {
        "flightId": 1,
        "airline": {
          "airlineId": 4,
          "name": "JetBlue"
        },
        "arrivalTime": "2020-05-15T13:15:00Z",
        "arrivalLocation": {
          "airportId": 1,
          "name": "Dulles International Airport",
          "address": "1 Saarinen Cir, Dulles, VA 20166",
          "airportCode": "IAD"
        },
        "departureTime": "2020-05-15T08:10:00Z",
        "departureLocation": {
          "airportId": 4,
          "name": "Miami International Airport",
          "address": "2100 NW 42nd Ave, Miami, FL 33126",
          "airportCode": "MIA"
        },
        "availableSeats": 45,
        "price": 135.00
      }];
    const expectedFlight: Flight = {
      flightId: 1,
      airline: {
        airlineId: 4,
        name: 'JetBlue'
      },
      arrivalTime: new Date("2020-05-15T13:15:00Z"),
      arrivalLocation: {
        airportId: 1,
        name: "Dulles International Airport",
        address: "1 Saarinen Cir, Dulles, VA 20166",
        airportCode: "IAD"
      },
      departureTime: new Date("2020-05-15T08:10:00Z"),
      departureLocation: {
        airportId: 4,
        name: "Miami International Airport",
        address: "2100 NW 42nd Ave, Miami, FL 33126",
        airportCode: "MIA"
      },
      availableSeats: 45,
      price: 135.00
    }
    httpClientSpy.get.and.returnValue(asyncData(expectedJsonFlights));
    service.getFlights().subscribe(
      flights => {
        expect(flights).toContain(expectedFlight, 'expected flight');
      },
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should return (server side paginated) flights', () => {
    const expectedJsonFlights = {
      data: [
        {
          "flightId": 1,
          "airline": {
            "airlineId": 4,
            "name": "JetBlue"
          },
          "arrivalTime": "2020-05-15T13:15:00Z",
          "arrivalLocation": {
            "airportId": 1,
            "name": "Dulles International Airport",
            "address": "1 Saarinen Cir, Dulles, VA 20166",
            "airportCode": "IAD"
          },
          "departureTime": "2020-05-15T08:10:00Z",
          "departureLocation": {
            "airportId": 4,
            "name": "Miami International Airport",
            "address": "2100 NW 42nd Ave, Miami, FL 33126",
            "airportCode": "MIA"
          },
          "availableSeats": 45,
          "price": 135.00
        }
      ],
      totalFlights: 30,
      totalFiltered: 30
    };
    const expectedFlight: Flight = {
      flightId: 1,
      airline: {
        airlineId: 4,
        name: 'JetBlue'
      },
      arrivalTime: new Date("2020-05-15T13:15:00Z"),
      arrivalLocation: {
        airportId: 1,
        name: "Dulles International Airport",
        address: "1 Saarinen Cir, Dulles, VA 20166",
        airportCode: "IAD"
      },
      departureTime: new Date("2020-05-15T08:10:00Z"),
      departureLocation: {
        airportId: 4,
        name: "Miami International Airport",
        address: "2100 NW 42nd Ave, Miami, FL 33126",
        airportCode: "MIA"
      },
      availableSeats: 45,
      price: 135.00
    };
    httpClientSpy.get.and.returnValue(asyncData(expectedJsonFlights));
    service.getPagedFlights(10, 0, 'flightId', false, '').subscribe(
      flights => {
        expect(flights.data).toContain(expectedFlight, 'expected flight');
        expect(flights.totalFiltered).toBe(30, 'expected totalFiltered');
        expect(flights.totalFlights).toBe(30, 'expected totalFlights');
      },
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should create a paymentIntent, returning paymentIntent', () => {
    const expectedIntentResponse: intentResponse = {
      client_secret: '1223345',
      id: '0098776'
    }
    oauthServiceSpy.authorizationHeader.and.returnValue('');
    httpClientSpy.post.and.returnValue(asyncData(expectedIntentResponse));
    service.createPaymentIntent(10).subscribe(res => {
      expect(res).toBe(expectedIntentResponse, 'expected intentResponse');
    });
    expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
  });

  it('should create a booking, returning success', () => {
    let booking: Booking = {
      bookingId: 0,
      patron: '1234',
      flight: 1234,
      ticketPrice: 15.00,
      numberOfTickets: 5,
      bookingAgent: '357951',
      paymentId: '951357'
    }
    oauthServiceSpy.authorizationHeader.and.returnValue('');
    oauthServiceSpy.getIdentityClaims.and.returnValue({sub: '357951', "cognito:groups": ['Counter']})
    httpClientSpy.post.and.returnValue(asyncData(booking));
    booking.bookingAgent = '';
    service.createBooking(booking).subscribe(res => {
      expect(res.bookingAgent).toBe('357951', 'expected returned booking agent sub');
    })
    expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
  });
});
