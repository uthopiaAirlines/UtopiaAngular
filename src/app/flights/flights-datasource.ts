import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Flight } from '../domain/flight';
import { FlightService } from '../service/flight/flight.service'

/**
 * Data source for the Flights view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class FlightsDataSource extends DataSource<Flight> {
  data: Observable<Flight[]>;
  dataArray: Flight[] = [];
  dataLength = 0;
  paginator: MatPaginator;
  sort: MatSort;

  constructor(private flightService: FlightService) {
    super();
    this.data = flightService.getFlights();
    this.data.subscribe(res => {
      this.dataArray = res;
      this.dataLength = this.dataArray.length;
    }, error => {console.log(error)})
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Flight[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      this.data,
      this.paginator.page,
      this.sort.sortChange
    ];
    return merge(...dataMutations).pipe(map(() => {
      this.data.subscribe(res => {
        this.dataArray = res;
        this.dataLength = this.dataArray.length;
      }, error => {console.log(error)})
      return this.getPagedData(this.getSortedData([...this.dataArray]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Flight[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Flight[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'flightId': return compare(a.flightId, b.flightId, isAsc);
        case 'price': return compare(+a.price, +b.price, isAsc);
        case 'departureTime': return compare(+a.departureTime, +b.departureTime, isAsc);
        case 'departureLocation': return compare(+a.departureLocation, +b.departureLocation, isAsc);
        case 'availableSeats': return compare(+a.availableSeats, +b.availableSeats, isAsc);
        case 'arrivalTime': return compare(+a.arrivalTime, +b.arrivalTime, isAsc);
        case 'arrivalLocation': return compare(+a.arrivalLocation, +b.arrivalLocation, isAsc);
        case 'airline': return compare(+a.airline, +b.airline, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
