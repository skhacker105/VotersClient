import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryCardComponent } from './industry-card.component';

describe('IndustryCardComponent', () => {
  let component: IndustryCardComponent;
  let fixture: ComponentFixture<IndustryCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndustryCardComponent]
    });
    fixture = TestBed.createComponent(IndustryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
