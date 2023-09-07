import { Pipe, PipeTransform } from '@angular/core';
import { DISCUSSION_STATE } from '../constants/discussion-state';

@Pipe({
  name: 'discussionStateIcon',
  pure: true
})
export class DiscussionStateIconPipe implements PipeTransform {

  transform(state: string): string {
    switch(state) {
      case DISCUSSION_STATE.open.display: return DISCUSSION_STATE.open.icon
      case DISCUSSION_STATE.closed.display: return DISCUSSION_STATE.closed.icon
      case DISCUSSION_STATE.reopened.display: return DISCUSSION_STATE.reopened.icon
      case DISCUSSION_STATE.blocked.display: return DISCUSSION_STATE.blocked.icon

      default: return DISCUSSION_STATE.open.icon
    }
  }

}
