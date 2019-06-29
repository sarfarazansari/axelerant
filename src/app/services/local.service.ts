import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const ASSETS_PATH = './assets/data/mock.json';

@Injectable({
  providedIn: 'root',
})
export class LocalService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  public getEventsMockData() {
    return this.http.get(ASSETS_PATH).toPromise();
  }

  public navigateToDetails(eventId: number) {
    const url = `/events/${eventId}`;
    this.router.navigate([url]);
  }

  public navigateToEventListing() {
    const url = `/events`;
    this.router.navigate([url]);
  }
}
