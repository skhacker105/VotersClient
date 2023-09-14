import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionRegisterComponent } from './discussion-register.component';

describe('DiscussionRegisterComponent', () => {
  let component: DiscussionRegisterComponent;
  let fixture: ComponentFixture<DiscussionRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscussionRegisterComponent]
    });
    fixture = TestBed.createComponent(DiscussionRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
