import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { Subject, take, takeUntil } from 'rxjs';
import { allScopeOptions } from 'src/app/core/constants/scope-options';
import { timelineOptions } from 'src/app/core/constants/timeline-options';
import { Discussion } from 'src/app/core/models/discussion';
import { GridConfig, IGridConfig } from 'src/app/core/models/paging';
import { IScope } from 'src/app/core/models/scope';
import { ITimeline } from 'src/app/core/models/timeline';
import { IUser } from 'src/app/core/models/user';
import { DiscussionService } from 'src/app/core/services/discussion.service';
import { LoggerService } from 'src/app/core/services/logger.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  id: string | undefined | null;
  ui_id: string | undefined | null;

  isComponentIsActive = new Subject<boolean>();
  myDiscussions = new GridConfig<Discussion[]>();
  news = new GridConfig<Discussion[]>();
  loginProfile: IUser | undefined;
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

  constructor(
    private discussionService: DiscussionService,
    private loggerService: LoggerService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loginProfile = this.userService.getProfile();
    this.trackQueryChange();
    this.loadMyDiscussions(this.myDiscussions.getCurrentPageQuery(this.myDiscussions));
  }

  ngOnDestroy(): void {
    this.isComponentIsActive.next(true);
    this.isComponentIsActive.complete();
  }

  trackQueryChange() {
    this.route.queryParamMap
    .pipe(takeUntil(this.isComponentIsActive))
    .subscribe((queryParams: any) => {
      this.id = queryParams?.params?.id;
      this.ui_id = queryParams?.params?.ui_id;
      this.loadDiscussionForVotePopup();
    })
  }

  loadDiscussionForVotePopup() {
    if (!this.id || (this.myDiscussions.data.length === 0 && this.news.data.length === 0)) return;

    const discussion = this.myDiscussions.data.find(discussion => discussion._id === this.id);
    const news = this.news.data.find(discussion => discussion._id === this.id);
    if (!discussion && !news) {
      this.loggerService.showError('We could not find any discussion you were searching.');
      this.router.navigateByUrl('/home');
      return;
    }

    if (discussion) this.loadVoteTypeForVotePopup(discussion);
    else if (news) this.loadVoteTypeForVotePopup(news);
  }

  loadVoteTypeForVotePopup(discussion: Discussion) {
    if (!this.ui_id || !this.loginProfile) return;

    const voteType = discussion.voteTypes.find(vt => vt.ui_id === this.ui_id);
    if (!voteType) {
      this.loggerService.showError('We could not find any discussion you were searching.');
      this.router.navigateByUrl('/home');
      return;
    }

    discussion.voteDiscussion(voteType, this.loginProfile)
    .pipe(take(1))
    .subscribe(res => {
      this.router.navigateByUrl('/home');
    })
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
          this.loadDiscussionForVotePopup();
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
