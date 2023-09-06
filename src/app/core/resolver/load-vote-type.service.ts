import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { VotingService } from '../services/voting.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadVoteTypeService implements Resolve<any> {

  constructor(private votingService: VotingService) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.votingService.loadVoteTypes();
  }
}
