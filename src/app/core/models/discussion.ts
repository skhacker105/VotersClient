import {MatDialog} from '@angular/material/dialog';
import {DISCUSSION_STATE} from '../constants/discussion-state';
import {IUser} from './user';
import {IVote, IVoteType, VoteCategory} from './vote';
import {IConfirmationDialogData} from './confirmation-dialog.model';
import {take} from 'rxjs';
import {ConfirmationDialogComponent} from '../component/confirmation-dialog/confirmation-dialog.component';
import {VotingService} from '../services/voting.service';
import {LoggerService} from '../services/logger.service';
import {DiscussionService} from '../services/discussion.service';
import {InputVoteWizardComponent} from '../component/input-vote-wizard/input-vote-wizard..component';
import {IInputVoteWizard} from './input-vote-wizars';
import {UserService} from '../services/user.service';
import {LoginRegisterComponent} from '../../modules/login-register/login-register/login-register.component';
import {IDiscussionState} from './discussion-state';
import {HelperService} from '../utilities/helper';

export class Discussion {
    matDialog : MatDialog;
    votingService : VotingService;
    loggerService : LoggerService;
    discussionService : DiscussionService;

    _id : string;
    title : string;
    message : string;
    private votes : IVote[] = [];
    isRegistrationAllowed : boolean;
    registrationStartDate : Date;
    registrationEndDate : Date;
    createdBy : IUser;
    createdOn : Date;
    private state : string;
    startDate?: Date;
    endDate?: Date;
    voteTypes : IVoteType[];

    stateObj : IDiscussionState | undefined;
    voteCategories : VoteCategory[] = [];
    nextPossibleStates : IDiscussionState[] = [];
    isVotingEnabled = false;
    isRegistrationEnabled = false;
    isBlocked = false;

    constructor(obj : Discussion, matDialog : MatDialog, votingService : VotingService, loggerService : LoggerService, discussionService : DiscussionService, public userService : UserService) {
        this._id = obj._id;
        this.title = obj.title;
        this.message = obj.message;
        this.votes = obj.votes;
        this.createdBy = obj.createdBy;
        this.createdOn = obj.createdOn;
        this.state = obj.state;
        this.isRegistrationAllowed = obj.isRegistrationAllowed;
        this.registrationStartDate = obj.registrationStartDate ? new Date(obj.registrationStartDate) : obj.registrationStartDate;
        this.registrationEndDate = obj.registrationEndDate ? new Date(obj.registrationEndDate) : obj.registrationEndDate;
        this.voteTypes = obj.voteTypes ? obj.voteTypes : [];
        this.startDate = obj.startDate ? new Date(obj.startDate) : obj.startDate;
        this.endDate = obj.endDate ? new Date(obj.endDate) : obj.endDate;

        this.votingService = votingService;
        this.loggerService = loggerService;
        this.discussionService = discussionService;
        this.matDialog = matDialog;
        this.resetStateObject();
        this.resetVotingEnability();
        this.resetBlockedState();
        this.resetRegistrationEnability();
        this.resetNextStates();
        this.categorizeVotes();
    }

    categorizeVotes() {
        const uniqueVoteTypes = this.votes.reduce((arr, val) => {
            let existing: VoteCategory |undefined = arr.find((cat) => cat.category.ui_id === val.voteType.ui_id);
            if (! existing) {
                existing = {
                    category: val.voteType,
                    votes: [val]
                };
                arr.push(existing);
            } else {
                existing.votes.push(val);
            }
            return arr;
        }, [] as VoteCategory[]);
        this.voteCategories = uniqueVoteTypes;
    }

    resetVotingEnability() {
        this.isVotingEnabled = (this.state === DISCUSSION_STATE['open'].key || this.state === DISCUSSION_STATE['reopened'].key)
        // && (!this.startDate || !this.endDate || HelperService.isTodayInDateRange(this.startDate, this.endDate));
    }

    resetRegistrationEnability() {
        this.isRegistrationEnabled = this.state === DISCUSSION_STATE['regOpen'].key
    }

    resetBlockedState() {
        this.isBlocked = this.state === DISCUSSION_STATE['blocked'].key;
    }

    resetNextStates() {
        try {
            this.nextPossibleStates = DISCUSSION_STATE[this.state].nextStates.filter(state => {
                const inclusive = state.neededForRegistration && this.isRegistrationAllowed;
                state.className = DISCUSSION_STATE[state.key].className;
                return !state.neededForRegistration || inclusive ? true : false
            });
        } catch (err) {
            console.log('There was error while fetching next possible states');
        }
    }

    resetStateObject() {
        try {
            this.stateObj = DISCUSSION_STATE[this.state]
        } catch(e) {
            this.stateObj = undefined;
        }
    }

    userHasAlreadyVoted(user : IUser) {
        return this.votes.find((v) => v.user._id === user._id);
    }

    existingVoteByType(user : IUser) {
        return this.votes.find((v) => v.user._id === user._id);
    }

    addVote(vote : IVote) {
        this.votes.push(vote);
        this.categorizeVotes();
    }

    updateVote(vote : IVote) {
        const index = this.votes.findIndex((v) => v._id === vote._id);
        if (index >= 0) {
            this.votes.splice(index, 1, vote);
            this.categorizeVotes();
        }
        this.voteTypes = JSON.parse(JSON.stringify(this.voteTypes));
    }

    isMyVote(voteType : IVote, user? : IUser): boolean {
        if (!user) 
            return false;
        


        return this.votes.some((v) => v.user._id === user._id && voteType.voteType.ui_id === v.voteType.ui_id);
    }

    isMyVoteType(voteType : IVoteType, user? : IUser): boolean {
        if (!user) 
            return false;
        


        return this.votes.some((v) => v.user._id === user._id && voteType.ui_id === v.voteType.ui_id);
    }

    getVotes() {
        return this.votes; // JSON.parse(JSON.stringify(this.votes));
    }

    confirmForStateChange(newState : IDiscussionState) {
        return new Promise((resolve, reject) => {
            if (this.nextPossibleStates.findIndex((s) => s.key === newState.key) === -1) 
                return reject(`Cannot set "${
                    this.title
                }" to "${newState}".`);
            


            const config: IConfirmationDialogData = {
                message: `${
                    newState.text.toUpperCase()
                } "${
                    this.title
                }"?`,
                okDisplay: newState.text.toUpperCase(),
                cancelDisplay: 'Cancel',
                color: 'warn'
            };
            const ref = this.matDialog['open'](ConfirmationDialogComponent, {data: config});
            ref.afterClosed().pipe(take(1)).subscribe((result) => resolve(result));
        });
    }

    changeState(newState : IDiscussionState) {
        this.state = newState.key;
        this.resetStateObject();
        this.resetVotingEnability();
        this.resetBlockedState();
        this.resetRegistrationEnability();
        this.resetNextStates();
    }

    getVoteCategoryCount(votetype? : IVoteType): number {
        if (!votetype) 
            return 0;
        


        const existingCategory = this.voteCategories.find((cat) => cat.category.ui_id === votetype.ui_id);
        if (! existingCategory) 
            return 0;
        


        return existingCategory.votes.length;
    }

    voteDiscussion(voteType : IVoteType, loginProfile? : IUser) { // if (!loginProfile) return;

        const existingvote = loginProfile ? this.existingVoteByType(loginProfile) : loginProfile;
        const data: IInputVoteWizard = {
            message: existingvote ? existingvote.message : '',
            voteType: voteType
        };
        const ref = this.matDialog['open'](InputVoteWizardComponent, {
            panelClass: 'input-textarea-popup',
            data: data,
            maxHeight: '90vh',
            minWidth: '90vw',
            enterAnimationDuration: '1000ms',
            exitAnimationDuration: '500ms'
        });
        ref.afterClosed().pipe(take(1)).subscribe((res) => {
            if (res) 
                if (loginProfile) 
                    this.saveVoteToDB(res, voteType, loginProfile);
                
             else 
                this.requestLogin(res, voteType);
            

        });

        return ref.afterClosed();
    }

    requestLogin(message : string, voteType : IVoteType) {
        const ref = this.matDialog['open'](LoginRegisterComponent, {
            panelClass: 'input-textarea-popup',
            maxHeight: '99vh',
            minWidth: '99vw'
        });
        ref.afterClosed().pipe(take(1)).subscribe((res) => {
            const loginProfile = this.userService.getProfile();
            if (! loginProfile) {
                this.loggerService.showError('Cannot Vote without login.');
                this.voteDiscussion(voteType, loginProfile);
            } else {
                this.saveVoteToDB(message, voteType, loginProfile);
            }
        });
    }

    saveVoteToDB(message : string, voteType : IVoteType, loginProfile : IUser) {
        if (!loginProfile) 
            return;
        


        const existingvote = this.userHasAlreadyVoted(loginProfile);
        const newVote = {
            discussion: this._id,
            message: message,
            user: loginProfile._id,
            voteType: voteType
        };

        (existingvote ? this.votingService.editVote(existingvote._id, newVote) : this.votingService.addVote(newVote)).pipe(take(1)).subscribe({
            next: (res) => {
                this.updateDiscussionVoteInDB(res.data, loginProfile);
                this.loggerService.showSuccess(`You Voted for "${
                    voteType.name
                }".`);
            },
            error: (err : any) => {
                this.loggerService.showError(err.error.message);
            }
        });
    }

    updateDiscussionVoteInDB(vote : IVote, loginProfile? : IUser) {
        if (!loginProfile) 
            return;
        

        const existingvote = this.userHasAlreadyVoted(loginProfile);
        if (existingvote) {
            this.updateVote(vote);
        } else {
            this.discussionService.vote(this._id, vote._id).pipe(take(1)).subscribe({
                next: (res) => {
                    if (res.data) 
                        this.addVote(vote);
                    

                },
                error: (err : any) => {
                    this.loggerService.showError(err.error.message);
                }
            });
        }
    }
}
