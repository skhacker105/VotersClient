import {Pipe, PipeTransform} from '@angular/core';
import {DISCUSSION_STATE} from '../constants/discussion-state';

@Pipe({name: 'discussionStateIcon', pure: true})
export class DiscussionStateIconPipe implements PipeTransform {

    transform(state : string): string {

        try {
            return DISCUSSION_STATE[state].icon
        } catch (err) {
            console.log(`There was error while fetching icon for state "${state}" with error: `, err);
            return 'warning'; // Error icon
        }
    }

}
