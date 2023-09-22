export interface IRegistrationState {
    key: string;
    text: string;
    icon: string;
    nextStates: IRegistrationState[],
    className?: string;
    neededForMember?: boolean,
    isDraft?: boolean
}