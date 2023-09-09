import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { MaterialModule } from './material/material.module';
import { SwipeDirective } from './directive/swipe.directive';
import { PageMessageComponent } from './component/page-message/page-message.component';
import { ConfirmationDialogComponent } from './component/confirmation-dialog/confirmation-dialog.component';
import { RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { PageHeaderComponent } from './component/page-header/page-header.component';
import { DiscussionCarouselComponent } from './component/discussion-carousel/discussion-carousel.component';
import { InputTextAreaComponent } from './component/input-text-area/input-text-area.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VoteBigScreenComponent } from './component/vote-big-screen/vote-big-screen.component';
import { VoteMobileScreenComponent } from './component/vote-mobile-screen/vote-mobile-screen.component';
import { NeedLocationAccessComponent } from './component/need-location-access/need-location-access.component';
import { VoteCarouselComponent } from './component/vote-carousel/vote-carousel.component';
import { DiscussionStateIconPipe } from './pipe/discussion-state-icon.pipe';
import { DiscussionStateDisplayPipe } from './pipe/discussion-state-display.pipe';
import { DiscussionNextStateComponent } from './component/discussion-next-state/discussion-next-state.component';
import { MatVoteTypeComponent } from './component/mat-vote-type/mat-vote-type.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SwipeDirective,
    PageMessageComponent,
    ConfirmationDialogComponent,
    PageHeaderComponent,
    DiscussionCarouselComponent,
    InputTextAreaComponent,
    VoteBigScreenComponent,
    VoteMobileScreenComponent,
    NeedLocationAccessComponent,
    VoteCarouselComponent,
    DiscussionStateIconPipe,
    DiscussionStateDisplayPipe,
    DiscussionNextStateComponent,
    MatVoteTypeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    QuillModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    MaterialModule,
    SwipeDirective,
    ConfirmationDialogComponent,
    RouterModule,
    QuillModule,
    PageHeaderComponent,
    DiscussionCarouselComponent,
    VoteBigScreenComponent,
    VoteMobileScreenComponent,
    NeedLocationAccessComponent,
    DiscussionStateIconPipe,
    DiscussionStateDisplayPipe,
    DiscussionNextStateComponent,
    MatVoteTypeComponent
  ]
})
export class CoreModule { }
