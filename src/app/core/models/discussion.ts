import { IUser } from "./user";
import { IVote, IVoteType, VoteCategory } from "./vote";

export class Discussion {
    _id: string;
    title: string;
    message: string;
    private votes: IVote[] = [];
    voteCategories: VoteCategory[] = [];
    createdBy: IUser;
    createdOn: Date;

    constructor(obj: Discussion) {
        this._id = obj._id;
        this.title = obj.title;
        this.message = obj.message;
        this.votes = obj.votes;
        this.createdBy = obj.createdBy;
        this.createdOn = obj.createdOn;
        this.categorizeVotes();
    }

    categorizeVotes() {
        const uniqueVoteTypes = this.votes.reduce((arr, val) => {
            let existing: VoteCategory | undefined = arr.find(cat => cat.category._id === val.voteType._id);
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
        return this.votes.some(v => v.user._id === user._id && voteType._id === v.voteType._id);
    }

    getVotes() {
        return JSON.parse(JSON.stringify(this.votes));
    }
}