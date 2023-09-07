import { Pipe, PipeTransform } from '@angular/core';
import { DISCUSSION_STATE } from '../constants/discussion-state';

@Pipe({
  name: 'discussionStateDisplay',
  pure: true
})
export class DiscussionStateDisplayPipe implements PipeTransform {

  transform(value: string): string {
    switch(value) {
      case DISCUSSION_STATE.open.display: return DISCUSSION_STATE.open.display
      case DISCUSSION_STATE.closed.display: return DISCUSSION_STATE.closed.display
      case DISCUSSION_STATE.reopened.display: return DISCUSSION_STATE.reopened.display
      case DISCUSSION_STATE.blocked.display: return DISCUSSION_STATE.blocked.display
      
      default: return DISCUSSION_STATE.open.display
    }
  }

}
