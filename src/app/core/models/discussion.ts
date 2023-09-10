import { MatDialog } from "@angular/material/dialog";
import { DISCUSSION_STATE } from "../constants/discussion-state";
import { IUser } from "./user";
import { IVote, IVoteType, VoteCategory } from "./vote";
import { IConfirmationDialogData } from "./confirmation-dialog.model";
import { take } from "rxjs";
import { ConfirmationDialogComponent } from "../component/confirmation-dialog/confirmation-dialog.component";
import { VotingService } from "../services/voting.service";
import { LoggerService } from "../services/logger.service";
import { DiscussionService } from "../services/discussion.service";
import { InputVoteWizardComponent } from "../component/input-vote-wizard/input-vote-wizard..component";
import { IInputVoteWizard } from "./input-vote-wizars";

export class Discussion {
    matDialog: MatDialog;
    votingService: VotingService;
    loggerService: LoggerService;
    discussionService: DiscussionService;

    _id: string;
    title: string;
    message: string;
    private votes: IVote[] = [];
    voteCategories: VoteCategory[] = [];
    createdBy: IUser;
    createdOn: Date;
    state: string;
    startDate?: Date;
    endDate?: Date;
    voteTypes: IVoteType[];

    nextPossibleStates: string[] = [];
    isVotingEnabled = false;
    isBlocked = false;

    constructor(obj: Discussion, matDialog: MatDialog, votingService: VotingService, loggerService: LoggerService, discussionService: DiscussionService) {
        this._id = obj._id;
        this.title = obj.title;
        this.message = obj.message;
        this.votes = obj.votes;
        this.createdBy = obj.createdBy;
        this.createdOn = obj.createdOn;
        this.state = obj.state;
        this.voteTypes = obj.voteTypes ? obj.voteTypes : [];
        this.startDate = obj.startDate;
        this.endDate = obj.endDate;
        this.votingService = votingService;
        this.loggerService = loggerService;
        this.discussionService = discussionService;

        this.matDialog = matDialog;
        this.resetEnability();
        this.resetBlockedState();
        this.resetNextStates();
        this.categorizeVotes();
    }

    categorizeVotes() {
        const uniqueVoteTypes = this.votes.reduce((arr, val) => {
            let existing: VoteCategory | undefined = arr.find(cat => cat.category.ui_id === val.voteType.ui_id);
            if (!existing) {
                existing = {
                    category: val.voteType,
                    votes: [val]
                }
                arr.push(existing)
            } else {
                existing.votes.push(val)
            }
            return arr;
        }, [] as VoteCategory[]);
        this.voteCategories = uniqueVoteTypes;
    }

    resetEnability() {
        this.isVotingEnabled = !this.state || this.state === DISCUSSION_STATE.open.display || this.state === DISCUSSION_STATE.reopened.display ? true : false;
    }

    resetBlockedState() {
        this.isBlocked = this.state === DISCUSSION_STATE.blocked.display
    }

    resetNextStates() {
        switch (this.state) {
            case DISCUSSION_STATE.open.display:
                this.nextPossibleStates = DISCUSSION_STATE.open.nextStates;
                break;
            case DISCUSSION_STATE.closed.display:
                this.nextPossibleStates = DISCUSSION_STATE.closed.nextStates;
                break;
            case DISCUSSION_STATE.blocked.display:
                this.nextPossibleStates = [];
                break;
            case DISCUSSION_STATE.reopened.display:
                this.nextPossibleStates = DISCUSSION_STATE.reopened.nextStates;
                break;
            default:
                this.nextPossibleStates = DISCUSSION_STATE.open.nextStates;
                break;
        }
    }

    userHasAlreadyVoted(user: IUser) {
        return this.votes.find(v => v.user._id === user._id)
    }

    existingVoteByType(user: IUser) {
        return this.votes.find(v => v.user._id === user._id)
    }

    addVote(vote: IVote) {
        this.votes.push(vote);
        this.categorizeVotes();
    }

    updateVote(vote: IVote) {
        const index = this.votes.findIndex(v => v._id === vote._id);
        if (index >= 0) {
            this.votes.splice(index, 1, vote);
            this.categorizeVotes();
        }
    }

    isMyVote(voteType: IVoteType, user: IUser) {
        return this.votes.some(v => v.user._id === user._id && voteType.ui_id === v.voteType.ui_id);
    }

    getVotes() {
        return this.votes; //JSON.parse(JSON.stringify(this.votes));
    }

    confirmForStateChange(newState: string) {
        return new Promise((resolve, reject) => {
            if (this.nextPossibleStates.findIndex(s => s === newState) === -1)
                return reject(`Cannot set "${this.title}" to "${newState}".`)

            const config: IConfirmationDialogData = {
                message: `${newState.toUpperCase()} "${this.title}"?`,
                okDisplay: newState.toUpperCase(),
                cancelDisplay: 'Cancel',
                color: 'warn'
            };
            const ref = this.matDialog.open(ConfirmationDialogComponent, {
                data: config
            })
            ref.afterClosed()
                .pipe(take(1))
                .subscribe(result => resolve(result))
        });
    }

    changeState(newState: string) {
        this.state = newState;
        this.resetEnability();
        this.resetBlockedState();
        this.resetNextStates();
    }

    getVoteCategoryCount(votetype?: IVoteType): number {
        if (!votetype) return 0;

        const existingCategory = this.voteCategories.find(cat => cat.category.ui_id === votetype.ui_id)
        if (!existingCategory) return 0;

        return existingCategory.votes.length;
    }

    voteDiscussion(voteType: IVoteType, loginProfile?: IUser) {
        if (!loginProfile) return;

        const existingvote = this.existingVoteByType(loginProfile);
        const data: IInputVoteWizard = {
            message: existingvote ? existingvote.message : '',
            voteType: voteType
        }
        const ref = this.matDialog.open(InputVoteWizardComponent,
            {
                panelClass: 'input-textarea-popup',
                data: data,
                maxHeight: '90vh',
                minWidth: '90vw'
            }
        )
        ref.afterClosed()
            .pipe(take(1))
            .subscribe(res => {
                if (res) this.saveVote(res, voteType, loginProfile);
            })

    }

    saveVote(message: string, voteType: IVoteType, loginProfile?: IUser) {
        if (!loginProfile) return;

        const existingvote = this.userHasAlreadyVoted(loginProfile);
        const newVote = {
            discussion: this._id,
            message: message,
            user: loginProfile._id,
            voteType: voteType
        };

        (
            existingvote
                ? this.votingService.editVote(existingvote._id, newVote)
                : this.votingService.addVote(newVote)
        )
            .pipe(take(1))
            .subscribe({
                next: (res) => {
                    this.updateDiscussionVote(res.data, loginProfile)
                },
                error: (err: any) => {
                    this.loggerService.showError(err.error.message)
                }
            });
    }

    updateDiscussionVote(vote: IVote, loginProfile?: IUser) {
        if (!loginProfile) return;

        const existingvote = this.userHasAlreadyVoted(loginProfile);
        if (existingvote) {
            this.updateVote(vote);
        } else {
            this.discussionService.vote(this._id, vote._id)
                .pipe(take(1))
                .subscribe({
                    next: (res) => {
                        if (res.data) this.addVote(vote);
                    },
                    error: (err: any) => {
                        this.loggerService.showError(err.error.message)
                    }
                });
        }
    }
}