import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, Subject } from 'rxjs';
import { Flight } from '../domain/flight';
import { FlightService } from '../service/flight/flight.service'
import { PagedData } from '../domain/pagedData';

/**
 * Data source for the Flights view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class FlightsDataSource extends DataSource<Flight> {
  data: Observable<PagedData>;
  dataArray: Flight[] = [];
  dataLength = 0;
  paginator: MatPaginator;
  sort: MatSort;
  filterSubject: Subject<string>;
  filterObservable: Observable<string>;
  filterString: string = "";

  constructor(private flightService: FlightService) {
    super();
    this.data = flightService.getPagedFlights(10, 0, 'flightId', true, this.filterString);
    this.filterSubject = new Subject<string>();
    this.filterObservable = this.filterSubject.asObservable();
    this.filterObservable.subscribe(res => {
      this.filterString = res;
    });
    this.data.subscribe(res => {
      this.dataArray = res.data;
      this.dataLength = res.totalFlights;
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
      this.sort.sortChange,
      this.filterObservable
    ];
    return merge(...dataMutations).pipe(map(() => {
      this.flightService.getPagedFlights(
        this.paginator.pageSize, 
        this.paginator.pageIndex, 
        ((this.sort.active === undefined) ? 'flightId' : this.sort.active), 
        ((this.sort.direction === 'asc') ? true : false), 
        this.filterString).subscribe(res => {
          this.dataArray = res.data;
          this.dataLength = res.totalFlights;
      });
      return this.dataArray;
      // return this.getPagedData(this.getSortedData([...this.dataArray.filter((flight) => {
      //   return (flight.airline.name.toLowerCase().includes(this.filterString) ||
      //           flight.arrivalLocation.name.toLowerCase().includes(this.filterString) ||
      //           flight.arrivalTime.toLocaleString().includes(this.filterString) ||
      //           flight.availableSeats.toString().includes(this.filterString) || 
      //           flight.departureLocation.name.toLocaleLowerCase().includes(this.filterString) || 
      //           flight.departureTime.toLocaleString().includes(this.filterString) ||
      //           flight.flightId.toString().includes(this.filterString) ||
      //           flight.price.toString().includes(this.filterString))
      // })]));
    }));
  }
  disconnect() {}

  filter(filterValue: string) {
    this.filterSubject.next(filterValue);
    this.filterObservable.subscribe(res => {
      this.filterString = res;
    });
  }

  private getPagedData(data: Flight[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  private getSortedData(data: Flight[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'flightId': return compare(a.flightId, b.flightId, isAsc);
        case 'price': return compare(+a.price, +b.price, isAsc);
        case 'departureTime': return compare(+a.departureTime.getTime(), +b.departureTime.getTime(), isAsc);
        case 'departureLocation': return compare(a.departureLocation.name, b.departureLocation.name, isAsc);
        case 'availableSeats': return compare(+a.availableSeats, +b.availableSeats, isAsc);
        case 'arrivalTime': return compare(+a.arrivalTime.getTime(), +b.arrivalTime.getTime(), isAsc);
        case 'arrivalLocation': return compare(a.arrivalLocation.name, b.arrivalLocation.name, isAsc);
        case 'airline': return compare(+a.airline.name, +b.airline.name, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

// return this.getPagedData(this.getSortedData([...this.dataArray.filter((flight) => {
//   return (flight.airline.name.toLowerCase().includes(this.filterString) ||
//           flight.arrivalLocation.name.toLowerCase().includes(this.filterString) ||
//           flight.arrivalTime.toLocaleString().includes(this.filterString) ||
//           flight.availableSeats.toString().includes(this.filterString) || 
//           flight.departureLocation.name.toLocaleLowerCase().includes(this.filterString) || 
//           flight.departureTime.toLocaleString().includes(this.filterString) ||
//           flight.flightId.toString().includes(this.filterString) ||
//           flight.price.toString().includes(this.filterString))
// })]));