import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteBigScreenComponent } from './vote-big-screen.component';

describe('VoteBigScreenComponent', () => {
  let component: VoteBigScreenComponent;
  let fixture: ComponentFixture<VoteBigScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoteBigScreenComponent]
    });
    fixture = TestBed.createComponent(VoteBigScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
