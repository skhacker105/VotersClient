import {Pipe, PipeTransform} from '@angular/core';
import {DISCUSSION_STATE} from '../constants/discussion-state';

@Pipe({name: 'discussionStateDisplay', pure: true})
export class DiscussionStateDisplayPipe implements PipeTransform {

    transform(value : string): string {

        try {
            return DISCUSSION_STATE[value].text
        } catch (err) {
            console.log(`There was error while fetching dispaly for state "${value}" with error: `, err);
            return 'warning'; // Error icon
        }
    }

}
