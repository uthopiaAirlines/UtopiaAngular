import { Flight } from './flight';

export interface PagedData {
    totalFlights: number,
    totalFiltered: number,
    data: Flight[]
}