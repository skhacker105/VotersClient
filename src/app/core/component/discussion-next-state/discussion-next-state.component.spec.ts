import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionNextStateComponent } from './discussion-next-state.component';

describe('DiscussionNextStateComponent', () => {
  let component: DiscussionNextStateComponent;
  let fixture: ComponentFixture<DiscussionNextStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscussionNextStateComponent]
    });
    fixture = TestBed.createComponent(DiscussionNextStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
