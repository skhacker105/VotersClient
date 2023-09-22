import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationProfileComponent } from './registration-profile.component';

describe('RegistrationProfileComponent', () => {
  let component: RegistrationProfileComponent;
  let fixture: ComponentFixture<RegistrationProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationProfileComponent]
    });
    fixture = TestBed.createComponent(RegistrationProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
