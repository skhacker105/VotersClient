import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationNextStateComponent } from './registration-next-state.component';

describe('RegistrationNextStateComponent', () => {
  let component: RegistrationNextStateComponent;
  let fixture: ComponentFixture<RegistrationNextStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationNextStateComponent]
    });
    fixture = TestBed.createComponent(RegistrationNextStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
