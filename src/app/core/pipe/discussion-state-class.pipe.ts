import {Pipe, PipeTransform} from '@angular/core';
import {DISCUSSION_STATE} from '../constants/discussion-state';

@Pipe({name: 'discussionStateClass'})
export class DiscussionStateClassPipe implements PipeTransform {

    transform(state : string): string | undefined {
        try {
            return DISCUSSION_STATE[state].className
        } catch (err) {
            console.log(`There was error while fetching icon for state "${state}" with error: `, err);
            return 'warning'; // Error icon
        }
    }

}
