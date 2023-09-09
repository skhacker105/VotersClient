import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatVoteTypeComponent } from './mat-vote-type.component';

describe('MatVoteTypeIconComponent', () => {
  let component: MatVoteTypeComponent;
  let fixture: ComponentFixture<MatVoteTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatVoteTypeComponent]
    });
    fixture = TestBed.createComponent(MatVoteTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
