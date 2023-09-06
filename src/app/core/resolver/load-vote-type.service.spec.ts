import { TestBed } from '@angular/core/testing';

import { LoadVoteTypeService } from './load-vote-type.service';

describe('LoadVoteTypeService', () => {
  let service: LoadVoteTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadVoteTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
