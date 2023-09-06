import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteMobileScreenComponent } from './vote-mobile-screen.component';

describe('VoteMobileScreenComponent', () => {
  let component: VoteMobileScreenComponent;
  let fixture: ComponentFixture<VoteMobileScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoteMobileScreenComponent]
    });
    fixture = TestBed.createComponent(VoteMobileScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
