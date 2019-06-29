import { Component, OnInit, OnDestroy, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { LocalService, WindowRefService } from 'src/app/services';
import { IEventListResponse } from 'src/app/interfaces';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';


@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) public cdkScrollViewport: CdkVirtualScrollViewport;
  public searchText = '';
  public eventList: IEventListResponse[] = [];
  public psObj: any = {
    innerBoxW: '100%',
    innerBoxH: '200px',
  };
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(
    private winRef: WindowRefService,
    private localService: LocalService,
    private cdRef: ChangeDetectorRef,
  ) { }

  @HostListener('window:resize', ['$event'])
  public handleResize(e: any) {
    this.addUIProp();
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public ngOnInit() {
    this.addUIProp();
    this.drawUI();
  }

  public goToEvent(event: IEventListResponse): void {
    this.localService.navigateToDetails(event.id);
  }

  private drawUI() {
    this.localService.getEventsMockData()
    .then((res: IEventListResponse[]) => {
      if (res && res.length > 0) {
        this.eventList = res;
      }
    });
  }

  private addUIProp() {
    if (this.winRef) {
      const W = this.winRef.nativeWindow.innerWidth;
      const H = this.winRef.nativeWindow.innerHeight;
      if (W && H) {
        // header + padding + bottom side
        const HEAD_HEIGHT = 56 + 24 + 50;
        this.psObj.width = `${W}px`;
        this.psObj.innerBoxH = `${H - HEAD_HEIGHT}px`;
      }
      // again resetting viewport to adjust full height
      setTimeout(() => {
        if (this.cdkScrollViewport) {
          this.cdkScrollViewport.checkViewportSize();
          this.cdRef.markForCheck();
        }
      }, 100);
    }
  }

}
