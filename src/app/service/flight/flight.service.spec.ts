import { TestBed } from '@angular/core/testing';

import { FlightService } from './flight.service';
import { asyncData } from 'src/test/asyncData';
import { Flight } from '../../domain/flight';
import { Airport } from '../../domain/airport';

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
});
