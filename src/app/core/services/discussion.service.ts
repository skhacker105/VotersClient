import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ServerResponse } from '../models/serverResponse';
import { Discussion } from '../models/discussion';
import { IGridConfig } from '../models/paging';
import { BehaviorSubject, map } from 'rxjs';
import { ITimeline } from '../models/timeline';
import { IScope } from '../models/scope';
import { MatDialog } from '@angular/material/dialog';
import { VotingService } from './voting.service';
import { LoggerService } from './logger.service';
import { UserService } from './user.service';
import { IDiscussionState } from '../models/discussion-state';
import { IRegisterVoteType } from '../models/vote';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  baseUrl = environment.basUrl + 'discussion/';
  selectedTimeLine = new BehaviorSubject<ITimeline | undefined>(undefined);
  selectedScope = new BehaviorSubject<IScope | undefined>(undefined);
  iconOptions = {
    matIcon: 'matIcon',
    image: 'image',
  };
  constructor(
    public http: HttpClient,
    private matDialog: MatDialog,
    private votingService: VotingService,
    private loggerService: LoggerService,
    private userService: UserService
  ) { }


  private Objectify(d: ServerResponse<Discussion>) {
    d.data = new Discussion(d.data, this.matDialog, this.votingService, this.loggerService, this, this.userService)
    return d;
  }
  private ObjectifyArr(darr: ServerResponse<Discussion[]>) {
    darr.data = darr.data.map(d => new Discussion(d, this.matDialog, this.votingService, this.loggerService, this, this.userService));
    return darr
  }
  private ObjectifyPagedArr(darr: ServerResponse<IGridConfig<Discussion[]>>) {
    darr.data.data = darr.data.data?.map(d => new Discussion(d, this.matDialog, this.votingService, this.loggerService, this, this.userService));
    return darr
  }

  getAll() {
    return this.http.get<ServerResponse<Discussion[]>>(this.baseUrl + 'getAll')
      .pipe(map(r => this.ObjectifyArr(r)))
  }

  get(id: string) {
    return this.http.get<ServerResponse<Discussion>>(this.baseUrl + 'get/' + id)
      .pipe(map(r => this.Objectify(r)));
  }

  getMyDiscussions(qry: IGridConfig<Discussion[]>) {
    return this.http.post<ServerResponse<IGridConfig<Discussion[]>>>(this.baseUrl + 'getMyDiscussions', qry)
      .pipe(map(r => this.ObjectifyPagedArr(r)));
  }

  add(discussion: any) {
    return this.http.post<ServerResponse<Discussion>>(this.baseUrl + 'add', discussion)
  }

  update(id: string, discussion: any) {
    return this.http.put<ServerResponse<Discussion>>(this.baseUrl + 'edit/' + id, discussion)
  }

  updateState(id: string, newState: IDiscussionState) {
    return this.http.put<ServerResponse<Discussion>>(this.baseUrl + 'updateState/' + id, { newState: newState.key })
  }

  delete(id: string) {
    return this.http.delete<ServerResponse<string>>(this.baseUrl + 'delete/' + id)
  }

  vote(id: string, voteId: string) {
    return this.http.post<ServerResponse<string>>(this.baseUrl + 'voteFor/' + id, { voteId })
  }

  registerProfile(id: string, profile: any) {
    return this.http.post<ServerResponse<IRegisterVoteType>>(this.baseUrl + `registerProfile/${id}`, profile);
  }

  updateProfile(id: string, profile: any) {
    return this.http.post<ServerResponse<IRegisterVoteType>>(this.baseUrl + `updateProfile/${id}`, profile);
  }

  updateRegistrationState(id: string, registration_id: string, newState: string) {
    return this.http.put<ServerResponse<string>>(this.baseUrl + `${id}/updateRegistrationState/${registration_id}`, {newState});
  }

}
