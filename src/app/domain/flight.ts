import { Airport } from './airport';

export interface Flight {
    flightId?: number;
    airline?: number;
    arrivalTime?: Date;
    arrivalLocation?: Airport;
    departureTime?: Date;
    departureLocation?: Airport;
    availableSeats?: number;
    price?: number;
}
