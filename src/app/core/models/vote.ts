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
    _id?: string;
    ui_id: string;
    iconOption: string;
    matIcon?: string;
    image: string;
    name?: string;
    profile?: string;
    createdBy: IUser;
    createdOn: Date;
}
