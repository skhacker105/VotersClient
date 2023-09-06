import { ITimeline } from "../models/timeline";

export const timelineOptions: ITimeline[] = [
    {
        id: 'thishr',
        backgroundColor: '#37ECD7',
        display: 'Last Hour',
        isActive: true
    },
    {
        id: 'yesterday',
        backgroundColor: '#FDAD34',
        display: 'Yesterday',
        isActive: true
    },
    {
        id: 'today',
        backgroundColor: '#A9DF00',
        display: 'Today',
        isActive: true
    },
    {
        id: 'thisWeek',
        backgroundColor: '#FC5556',
        display: 'Week',
        isActive: true
    },
    {
        id: 'thisMonth',
        backgroundColor: '#04CAFF',
        display: 'Month',
        isActive: true
    },
    {
        id: 'thisYear',
        backgroundColor: '#FFDE18',
        display: 'Year',
        isActive: true
    }
];