import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVoteTypeComponent } from './add-edit-vote-type.component';

describe('AddEditVoteTypeComponent', () => {
  let component: AddEditVoteTypeComponent;
  let fixture: ComponentFixture<AddEditVoteTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditVoteTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditVoteTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
