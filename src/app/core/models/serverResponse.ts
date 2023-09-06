export interface ServerResponse<T> {
    message: string;
    data: T;
    errors: any
}