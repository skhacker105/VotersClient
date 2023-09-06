import { IUser } from "./user";

export interface IVote {
    _id: string;
    user: IUser;
    message: string;
    voteType: IVoteType;
    discussion: string;
    createdOn: Date;
}

export interface VoteCategory {
    category: IVoteType;
    votes: IVote[];
}

export interface IVoteType {
    _id: string;
    name: string;
    icon: string;
    reportName: string;
    createdBy: IUser;
    createdOn: Date;
}
