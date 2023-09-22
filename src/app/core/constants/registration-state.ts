import { IRegistrationState } from "../models/registration-state";

export const REGISTRATION_STATE: { [key: string]: IRegistrationState } = {
    draft: {
        key: 'draft',
        text: 'Draft',
        icon: 'edit_note',
        className: 'registration-state-draft',
        nextStates: [
            {
                key: 'pendingApproval',
                text: 'Submit',
                icon: 'schedule',
                nextStates: [],
                className: 'registration-state-pending',
                neededForMember: true
            },
        ],
        isDraft: true
    },
    pendingApproval: {
        key: 'pendingApproval',
        text: 'Approval Pending',
        icon: 'schedule',
        className: 'registration-state-pending',
        nextStates: [
            {
                key: 'approved',
                text: 'Approve',
                icon: 'thumb_up',
                className: 'registration-state-approved',
                nextStates: []
            }, {
                key: 'rejected',
                text: 'Reject',
                icon: 'thumb_down',
                className: 'registration-state-rejected',
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
                key: 'draft',
                text: 'Un-Approve',
                icon: 'person_remove',
                className: 'registration-state-pending',
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
                key: 'draft',
                text: 'Re-Open',
                icon: 'edit_note',
                className: 'registration-state-draft',
                nextStates: [],
                neededForMember: true
            }
        ]
    }
};
