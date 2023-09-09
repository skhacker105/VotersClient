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
}