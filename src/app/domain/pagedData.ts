import { Flight } from './flight';

export interface PagedData {
    totalFlights: number,
    data: Flight[]
}