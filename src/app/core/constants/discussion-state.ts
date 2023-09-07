export const DISCUSSION_STATE = {
    open: {
        display: 'OPEN',
        icon: 'lock_open',
        nextStates: ['CLOSE', 'BLOCK']
    },
    closed: {
        display: 'CLOSE',
        icon: 'lock',
        nextStates: ['RE-OPEN', 'BLOCK']
    },
    reopened: {
        display: 'RE-OPEN',
        icon: 'curtains',
        nextStates: ['CLOSE', 'BLOCK']
    },
    blocked: {
        display: 'BLOCK',
        icon: 'block',
        nextStates: []
    }
};