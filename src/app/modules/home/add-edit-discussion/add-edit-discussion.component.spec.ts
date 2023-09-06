import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDiscussionComponent } from './add-edit-discussion.component';

describe('AddEditDiscussionComponent', () => {
  let component: AddEditDiscussionComponent;
  let fixture: ComponentFixture<AddEditDiscussionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditDiscussionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
