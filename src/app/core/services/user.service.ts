import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/user';
import { ServerResponse } from '../models/serverResponse';
import decode from 'jwt-decode';
import { BehaviorSubject, forkJoin, map, mergeMap, of } from 'rxjs';
import { Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // localStorage
  private userToken = 'token';
  private avtarToken = 'avtar';

  // standard icon dimesntions
  standardIconHeight = 100;
  standardIconWidth = 100;


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

  loadUserAvatar(userId: string) {
    return this.http.get<ServerResponse<string>>(this.baseUrl + 'getAvatar/' + userId);
  }

  getUserById(userId: string) {
    return forkJoin([
      this.http.get<ServerResponse<IUser>>(this.baseUrl + `getProfile/${userId}`),
      this.loadUserAvatar(userId)
    ]).pipe(
      map(([userRes, avatar]) => {
        if (avatar.data && userRes.data) userRes.data.avatar = avatar.data
        return userRes;
      })
    )
  }

  updateUserPersoanlInfoById(info: any) {
    return this.http.post<ServerResponse<string>>(this.baseUrl + `updateProfile`, info);
  }

  registerLocationChange() {
    return this.http.get<ServerResponse<string>>(this.baseUrl + 'registerLocationChange')
  }

  saveSession(token: any): void {
    localStorage.setItem(this.userToken, token);
  }

  clearSession(): void {
    localStorage.clear();
  }

  getProfile(token?: string): IUser | undefined {
    try {
      const decoded: any = token ? decode(token) : decode(this.getToken(this.userToken));
      const usr: IUser = decoded.sub;
      return usr;
    } catch (err) {
      return undefined;
    }
  }

  getExpiryTime(): Date | undefined {
    try {
      const decoded: any = decode(this.getToken(this.userToken));
      return decoded.exp;
    } catch (err) {
      return undefined;
    }
  }

  isLoggedIn(): boolean {
    try {
      const decoded: any = decode(this.getToken(this.userToken));

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
      const decoded: any = decode(this.getToken(this.userToken));

      if (decoded.exp < Date.now() / 1000 || !decoded.sub.isAdmin) {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  }

  getToken(key: string = this.userToken): string {
    let val = localStorage.getItem(key);
    return val ? val : '';
  }

  isAuthLocationChanged(changed: boolean) {
    this.authLocationChanged = changed;
  }

  saveAvatar(avatar: string) {
    localStorage.setItem(this.avtarToken, avatar);
  }

  getAvatar(): string {
    return this.getToken(this.avtarToken);
  }

  resizeImage(imageURL: any): Promise<any> {
    const standardIconHeight = this.standardIconHeight;
    const standardIconWidth = this.standardIconWidth;
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = standardIconHeight;
        canvas.height = standardIconWidth;
        const ctx = canvas.getContext('2d');
        if (ctx != null) {
          ctx.drawImage(image, 0, 0, standardIconHeight, standardIconWidth);
        }
        var data = canvas.toDataURL('image/jpeg', 1);
        resolve(data);
      };
      image.src = imageURL;
    });
  }

}
