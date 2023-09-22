import { IRegistrationState } from "./registration-state";
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

export interface IRegisterVoteType extends IVoteType {
    state: string;
    stateObj?: IRegistrationState;
    lastStateChangedOn: Date;
    nextPossibleStates: IRegistrationState[];
}

export interface IRegisterCategory {
    category: string;
    registrations: IRegisterVoteType[];
}

export const isInstanceOfIVoteType = (obj: any): obj is IVoteType => {
    try {
        if (obj['ui_id']) return true;
        return false;
    } catch(e) {
        return false;
    }
}
