import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IVote, IVoteType } from '../models/vote';
import { ServerResponse } from '../models/serverResponse';
import { environment } from 'src/environments/environment';
import { catchError, of, tap } from 'rxjs';
import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class VotingService {

  baseUrlVote = environment.basUrl + 'vote/';
  baseUrlVoteType = environment.basUrl + 'votetype/';
  allVoteTypes: IVoteType[] = [];
  constructor(public http: HttpClient) { }

  loadVoteTypes() {
    return this.http.get<ServerResponse<IVoteType[]>>(this.baseUrlVoteType + 'getAll')
      .pipe(
        tap(res => this.allVoteTypes = res.data),
        catchError(err => {
          console.log('Error: ', err);
          return of([])
        })
      )
  }

  getAll() {
    return this.http.get<ServerResponse<IVoteType[]>>(this.baseUrlVoteType + 'getAll')
  }

  add(vote: any) {
    return this.http.post<ServerResponse<IVoteType>>(this.baseUrlVoteType + 'add', vote)
  }

  update(id: string, vote: any) {
    return this.http.put<ServerResponse<IVoteType>>(this.baseUrlVoteType + 'edit/' + id, vote)
  }

  delete(id: string) {
    return this.http.delete<ServerResponse<string>>(this.baseUrlVoteType + 'delete/' + id)
  }

  addVote(data: any) {
    return this.http.post<ServerResponse<IVote>>(this.baseUrlVote + 'add', data)
  }

  editVote(id: string, vote: any) {
    return this.http.put<ServerResponse<IVote>>(this.baseUrlVote + 'edit/' + id, vote)
  }

  deleteVote(id: string) {
    return this.http.delete<ServerResponse<string>>(this.baseUrlVote + 'delete/' + id)
  }

  isOwner(vote: IVote, loaginUser?: IUser) {
    return vote.user._id === loaginUser?._id
  }
}
