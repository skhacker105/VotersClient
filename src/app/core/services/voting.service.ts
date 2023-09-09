import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IVote, IVoteType } from '../models/vote';
import { ServerResponse } from '../models/serverResponse';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/user';
import { MATERIAL_ICONS } from '../constants/material-icon';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class VotingService {

  baseUrlVote = environment.basUrl + 'vote/';
  baseUrlVoteType = environment.basUrl + 'votetype/';
  allVoteTypes: IVoteType[];
  constructor(public http: HttpClient, private userService: UserService) {
    this.allVoteTypes = MATERIAL_ICONS.map((icon, i) => {
      return {
        ui_id: '',
        matIcon: icon
      } as IVoteType
    });
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
