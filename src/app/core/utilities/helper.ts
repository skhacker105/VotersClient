import { COOL_COLORS } from "../constants/cool-colors";

export class HelperService {

    static NEWID = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    static isInViewPort(selector: string) {
        const box = document.querySelector(selector);
        if (!box) return false;

        const rect = box.getBoundingClientRect();

        return rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth);

    }

    static generateRandomCoolColors(str: string = this.NEWID(10)) {
        const numStr = str.split('').map(s => s.charCodeAt(0)).reduce((s, v) => s + v, 0);
        if (numStr <= 0) return COOL_COLORS[0];
        return COOL_COLORS[(numStr % COOL_COLORS.length)]
    }

    static isTodayInDateRange(dt1: Date, dt2: Date): boolean {
        const start = new Date(dt1).getTime();
        const end_date = new Date(dt2);
        end_date.setHours(23, 59, 59, 999);
        const end = end_date.getTime();
        const today = new Date().getTime();
        return today >= start && today <= end;
    }
}