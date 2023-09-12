import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLocationChangedComponent } from './auth-location-changed.component';

describe('AuthLocationChangedComponent', () => {
  let component: AuthLocationChangedComponent;
  let fixture: ComponentFixture<AuthLocationChangedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthLocationChangedComponent]
    });
    fixture = TestBed.createComponent(AuthLocationChangedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
