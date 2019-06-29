import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { LocalService } from 'src/app/services';
import { IEventListResponse } from 'src/app/interfaces';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line: no-inferrable-types
  public successMsg: string = 'Tickets booked';
  // tslint:disable-next-line: no-inferrable-types
  public formSubmitSuccess: boolean = false;
  public selectedEvent: IEventListResponse;
  public bookingForm: FormGroup;
  public attendees: FormArray;
  public availableSeats = [1, 2, 3, 4, 5, 6];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private route: ActivatedRoute,
    private localService: LocalService,
    private formBuilder: FormBuilder
  ) {
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public ngOnInit() {
    this.initForm();
    // get event id from route and
    this.route.params.pipe(takeUntil(this.destroyed$))
    .subscribe((params: any) => {
      if (params && params.eventId) {
        this.fetchDataFromRecords(+params.eventId);
      }
    });

    if (this.bookingForm) {
      // listen for seats and append dynamic inputs
      if (this.bookingForm.controls && this.bookingForm.controls.seats) {
        this.bookingForm.controls.seats.valueChanges.subscribe(count => {
          this.addItem(count);
        });
      }
    }
  }

  public goToEventListingPage() {
    this.localService.navigateToEventListing();
  }

  public handleFormSubmit() {
    console.log('finally form value:');
    console.log(this.bookingForm.value);
    setTimeout(() => {
      this.formSubmitSuccess = true;
    }, 1000);
  }

  public addItem(count: number): void {
    // reset first
    // this.bookingForm.controls.attendees = this.formBuilder.array([]);
    // now set again
    this.attendees = this.bookingForm.get('attendees') as FormArray;
    if (count) {
      for (let i = 0; i < count; i++) {
        this.attendees.push(this.createItem(count));
      }
    }
  }

  public createItem(count: number): any {
    return new FormControl('', Validators.compose([
      Validators.required
    ]));
  }

  private fetchDataFromRecords(id: number) {
    this.localService.getEventsMockData()
    .then((res: IEventListResponse[]) => {
      if (res && res.length > 0) {
        this.selectedEvent = res.find(item => item.id === id);

        // if no seat is available then will redirect to list page
        if (this.selectedEvent && this.selectedEvent.seats === 0) {
          this.goToEventListingPage();
        }

        // to handle again via regex changing data source
        // if seats is less than available option
        // modifying data source
        if (this.selectedEvent) {
          this.availableSeats = this.availableSeats.filter(item => item <= this.selectedEvent.seats);
        }
      }
    });
  }

  private initForm() {
    // tslint:disable-next-line: max-line-length
    const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    this.bookingForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-z][a-z\s]*$/)
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(EMAIL_REGEX)
      ])),
      phone: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(/^[0-9]+$/)
      ])),
      seats: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      attendees: this.formBuilder.array([])
    });

  }

}
