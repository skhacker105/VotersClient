import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/user';
import { ServerResponse } from '../models/serverResponse';
import decode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { IUserLocation } from '../models/user-location';
import { Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.basUrl + 'users/';
  hasLocationAccess = new BehaviorSubject<Position | undefined>(undefined);
  authLocationChanged = false;
  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<ServerResponse<string>>(this.baseUrl + 'login', { email, password })
  }

  register(email: string, password: string, name: string) {
    return this.http.post<ServerResponse<string>>(this.baseUrl + 'register', { email, password, name })
  }

  registerLocationChange() {
    return this.http.get<ServerResponse<string>>(this.baseUrl + 'registerLocationChange')
  }

  saveSession(token: any): void {
    localStorage.setItem('token', token);
  }

  clearSession(): void {
    localStorage.clear();
  }

  getProfile(): IUser | undefined {
    try {
      const decoded: any = decode(this.getToken());
      const usr: IUser = decoded.sub;
      return usr;
    } catch (err) {
      return undefined;
    }
  }

  getExpiryTime(): Date | undefined {
    try {
      const decoded: any = decode(this.getToken());
      return decoded.exp;
    } catch (err) {
      return undefined;
    }
  }

  isLoggedIn(): boolean {
    try {
      const decoded: any = decode(this.getToken());

      if (decoded.exp > Date.now() / 1000) {
        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  }

  isAdmin(): boolean {
    try {
      const decoded: any = decode(this.getToken());

      if (decoded.exp < Date.now() / 1000 || !decoded.sub.isAdmin) {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  }

  getToken(): string {
    let val = localStorage.getItem('token');
    return val ? val : '';
  }

  isAuthLocationChanged(changed: boolean) {
    this.authLocationChanged = changed;
  }

}
