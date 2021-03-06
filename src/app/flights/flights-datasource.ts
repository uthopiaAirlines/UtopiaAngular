import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, mergeMap } from 'rxjs/operators';
import { Observable, of as observableOf, merge, Subject, of } from 'rxjs';
import { Flight } from '../domain/flight';
import { FlightService } from '../service/flight/flight.service'
import { PagedData } from '../domain/pagedData';

import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

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

  constructor(private flightService: FlightService, private dialog: MatDialog) {
    super();
    this.data = flightService.getPagedFlights(10, 0, 'flightId', true, this.filterString);
    this.filterSubject = new Subject<string>();
    this.filterObservable = this.filterSubject.asObservable();
    this.filterObservable.subscribe(res => {
      this.filterString = res;
      this.paginator.firstPage();
    });
    this.data.subscribe(res => {
      this.dataArray = res.data;
      this.dataLength = res.totalFiltered;
    }, error => {
      this.dialog.open(ErrorDialogComponent);
    })
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
    return merge(...dataMutations).pipe(mergeMap(() => {
      return this.flightService.getPagedFlights(
        this.paginator.pageSize,
        this.paginator.pageIndex,
        ((this.sort.active === undefined) ? 'flightId' : this.sort.active),
        ((this.sort.direction === 'desc') ? false : true),
        this.filterString).toPromise().then(res => {
          this.dataArray = res.data;
          this.dataLength = res.totalFiltered;
          return res.data;
        });
    }))
  }
  disconnect() { }

  filter(filterValue: string) {
    this.filterSubject.next(filterValue);
    this.filterObservable.subscribe(res => {
      this.filterString = res;
      this.paginator.firstPage();
    });
  }
}