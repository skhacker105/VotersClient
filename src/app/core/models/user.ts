export interface IUser {
    _id: string;
    email: string;
    name: string;
    avatar?: string;
    isAdmin?: boolean;
    address?: IAddress[]
}

export interface IAddress {
    location: string;
    accessDate: string;
    latitude: string;
    longitude: string;
}