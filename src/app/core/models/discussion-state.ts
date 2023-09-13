export interface IDiscussionState {
    key: string;
    text: string;
    icon: string;
    nextStates: IDiscussionState[],
    className?: string;
    neededForRegistration?: boolean
}