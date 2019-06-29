import { Pipe, PipeTransform } from '@angular/core';
import { IEventListResponse } from '../interfaces';

@Pipe({
  name: 'myEventPipe',
  pure: true
})
// return the value of the function passed as parameter when pipe is used
export class EventsPipeFunction implements PipeTransform {
  public transform(events: any[], term: string): any {
    if (!events) {
      return [];
    }
    if (events.length === 0) {
      return events;
    }

    term = term.trim().toLowerCase();

    if (term === '') {
      return events;
    }

    // will search for included term and starting term
    if (term && term.length > 1 && events && events.length) {
      const startsWithArr: any[] = [];
      const includesArr: any[] = [];
      events.forEach((item: IEventListResponse) => {
        if (item.name.toLocaleLowerCase().startsWith(term)) {
          startsWithArr.push(item);
        } else if (item.name.toLocaleLowerCase().includes(term)) {
          includesArr.push(item);
        }
      });
      return [...startsWithArr, ...includesArr];
    }

    return events;
  }
}
