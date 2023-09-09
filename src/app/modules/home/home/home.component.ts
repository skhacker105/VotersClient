import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { Subject, take, takeUntil } from 'rxjs';
import { allScopeOptions } from 'src/app/core/constants/scope-options';
import { timelineOptions } from 'src/app/core/constants/timeline-options';
import { Discussion } from 'src/app/core/models/discussion';
import { GridConfig, IGridConfig } from 'src/app/core/models/paging';
import { IScope } from 'src/app/core/models/scope';
import { ITimeline } from 'src/app/core/models/timeline';
import { DiscussionService } from 'src/app/core/services/discussion.service';
import { LoggerService } from 'src/app/core/services/logger.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  isComponentIsActive = new Subject<boolean>();
  myDiscussions = new GridConfig<Discussion[]>();
  news = new GridConfig<Discussion[]>();
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 600,
    navText: [],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      760: {
        items: 3
      },
      1000: {
        items: 4
      }
    },
    nav: false,
  }

  allTimeLines: ITimeline[] = timelineOptions;
  selectedTimeLine: ITimeline = this.allTimeLines[0];
  allScopes: IScope[] = allScopeOptions;
  selectedScope: IScope = this.allScopes[0];

  constructor(private discussionService: DiscussionService, private loggerService: LoggerService) { }

  ngOnInit(): void {
    this.loadMyDiscussions(this.myDiscussions.getCurrentPageQuery(this.myDiscussions))
  }

  ngOnDestroy(): void {
    this.isComponentIsActive.next(true);
    this.isComponentIsActive.complete();
  }

  handleSlidedData(slideState: SlidesOutputData) {
    const trigger = !slideState.slides || !slideState.startPosition ? false : (slideState.startPosition + slideState.slides.length) < this.myDiscussions.dataLength
    if (trigger) this.loadMyDiscussionNextPage(slideState);
  }

  loadMyDiscussions(qry: IGridConfig<Discussion[]>, slideState?: SlidesOutputData) {
    if (!qry) return;

    this.discussionService.getMyDiscussions(qry)
      .pipe(takeUntil(this.isComponentIsActive), take(1))
      .subscribe({
        next: res => {
          this.customOptions.startPosition = slideState?.startPosition
          res.data.data = this.myDiscussions.data.concat(res.data.data)
          this.myDiscussions.setData(res.data);
        },
        error: err => {
          this.loggerService.showError(err.error.message);
        }
      });
  }

  loadMyDiscussionNextPage(slideState?: SlidesOutputData) {
    if (this.myDiscussions.hasNextPage()) {
      const newqry = this.myDiscussions.getNextPageQuery(this.myDiscussions);
      if (newqry) this.loadMyDiscussions(newqry, slideState)
    }
  }


  setTimeLine(timeline: ITimeline) {
    this.selectedTimeLine = timeline;
    this.discussionService.selectedTimeLine.next(timeline);
  }

  setScope(scope: IScope) {
    this.selectedScope = scope;
    this.discussionService.selectedScope.next(scope);
  }
}
