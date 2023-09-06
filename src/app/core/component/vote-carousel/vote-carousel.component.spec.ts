import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteCarouselComponent } from './vote-carousel.component';

describe('VoteCarouselComponent', () => {
  let component: VoteCarouselComponent;
  let fixture: ComponentFixture<VoteCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoteCarouselComponent]
    });
    fixture = TestBed.createComponent(VoteCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
