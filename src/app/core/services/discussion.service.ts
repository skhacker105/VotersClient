import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ServerResponse } from '../models/serverResponse';
import { Discussion } from '../models/discussion';
import { IGridConfig } from '../models/paging';
import { BehaviorSubject, map } from 'rxjs';
import { ITimeline } from '../models/timeline';
import { IScope } from '../models/scope';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  baseUrl = environment.basUrl + 'discussion/';
  selectedTimeLine = new BehaviorSubject<ITimeline | undefined>(undefined);
  selectedScope = new BehaviorSubject<IScope | undefined>(undefined);
  constructor(public http: HttpClient) { }


  private Objectify(d: ServerResponse<Discussion>) {
    d.data = new Discussion(d.data)
    return d;
  }
  private ObjectifyArr(darr: ServerResponse<Discussion[]>) {
    darr.data = darr.data.map(d => new Discussion(d));
    return darr
  }
  private ObjectifyPagedArr(darr: ServerResponse<IGridConfig<Discussion[]>>) {
    darr.data.data = darr.data.data?.map(d => new Discussion(d));
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

  delete(id: string) {
    return this.http.delete<ServerResponse<string>>(this.baseUrl + 'delete/' + id)
  }

  vote(id: string, voteId: string) {
    return this.http.post<ServerResponse<string>>(this.baseUrl + 'voteFor/' + id, { voteId })
  }

}
