import {IDiscussionState} from "../models/discussion-state";

export const DISCUSSION_STATE: {[key:string]:IDiscussionState} = {
    draft: {
        key: 'draft',
        text: 'Draft',
        icon: 'edit_note',
        className: 'decesion-state-draft',
        nextStates: [
            {
                key: 'regOpen',
                text: 'Open Registration',
                icon: '',
                nextStates: [],
                neededForRegistration: true
            }, {
                key: 'open',
                text: 'Open For Voting',
                icon: '',
                nextStates: []
            }, {
                key: 'blocked',
                text: 'Block Voting',
                icon: '',
                nextStates: []
            }
        ]
    },
    open: {
        key: 'open',
        text: 'Open for voting',
        icon: 'how_to_vote',
        className: 'decesion-state-open',
        nextStates: [
            {
                key: 'closed',
                text: 'Close Voting',
                icon: '',
                nextStates: []
            }, {
                key: 'blocked',
                text: 'Block Voting',
                icon: '',
                nextStates: []
            }
        ]
    },
    closed: {
        key: 'closed',
        text: 'Closed for voting',
        icon: 'stop_circle',
        className: 'decesion-state-closed',
        nextStates: [
            {
                key: 'regOpen',
                text: 'ReOpen Registration',
                icon: '',
                nextStates: [],
                neededForRegistration: true
            },
            {
                key: 'reopened',
                text: 'ReOpen Voting',
                icon: '',
                nextStates: []
            }, {
                key: 'blocked',
                text: 'Block Voting',
                icon: '',
                nextStates: []
            }
        ]
    },
    reopened: {
        key: 'reopened',
        text: 'Reopened for voting',
        icon: 'play_circle',
        className: 'decesion-state-reopened',
        nextStates: [
            {
                key: 'closed',
                text: 'Close Voting',
                icon: '',
                nextStates: []
            }, {
                key: 'blocked',
                text: 'Block Voting',
                icon: '',
                nextStates: []
            }
        ]
    },
    blocked: {
        key: 'blocked',
        text: 'Blocked',
        icon: 'blocked',
        className: 'decesion-state-blocked',
        nextStates: [{
            key: 'draft',
            text: 'Unblock to Draft',
            icon: '',
            nextStates: []
        }]
    },
    regOpen: {
        key: 'regOpen',
        text: 'Registration Open',
        icon: 'app_registration',
        className: 'decesion-state-regOpen',
        nextStates: [
            {
                key: 'regClose',
                text: 'Close Registration',
                icon: '',
                nextStates: [],
                neededForRegistration: true
            }, {
                key: 'blocked',
                text: 'Block Voting',
                icon: '',
                nextStates: []
            }
        ]
    },
    regClose: {
        key: 'regClose',
        text: 'Registration Closed',
        icon: 'app_registration',
        className: 'decesion-state-regClose',
        nextStates: [
            {
                key: 'regOpen',
                text: 'ReOpen Registration',
                icon: '',
                nextStates: [],
                neededForRegistration: true
            }, {
                key: 'open',
                text: 'Open For Voting',
                icon: '',
                nextStates: []
            }, {
                key: 'blocked',
                text: 'Block Voting',
                icon: '',
                nextStates: []
            }
        ]
    }
};
