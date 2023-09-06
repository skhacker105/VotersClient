import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedLocationAccessComponent } from './need-location-access.component';

describe('NeedLocationAccessComponent', () => {
  let component: NeedLocationAccessComponent;
  let fixture: ComponentFixture<NeedLocationAccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NeedLocationAccessComponent]
    });
    fixture = TestBed.createComponent(NeedLocationAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
