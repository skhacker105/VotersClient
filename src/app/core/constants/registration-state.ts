import { IRegistrationState } from "../models/registration-state";

export const REGISTRATION_STATE: {[key:string]:IRegistrationState} = {
    pendingApproval: {
        key: 'pendingApproval',
        text: 'Approval Pending',
        icon: 'schedule',
        className: 'registration-state-pending',
        nextStates: [
            {
                key: 'approved',
                text: 'Approve',
                icon: '',
                nextStates: []
            }, {
                key: 'rejected',
                text: 'Reject',
                icon: '',
                nextStates: []
            }
        ]
    },
    approved: {
        key: 'approved',
        text: 'Approved',
        icon: 'thumb_up',
        className: 'registration-state-approved',
        nextStates: [
            {
                key: 'pendingApproval',
                text: 'Remove',
                icon: '',
                nextStates: []
            }
        ]
    },
    rejected: {
        key: 'rejected',
        text: 'Rejected',
        icon: 'thumb_down',
        className: 'registration-state-rejected',
        nextStates: [
            {
                key: 'pendingApproval',
                text: 'Re-Open',
                icon: '',
                nextStates: []
            }
        ]
    }
};
