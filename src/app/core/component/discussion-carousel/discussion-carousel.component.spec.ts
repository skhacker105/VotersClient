import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionCarouselComponent } from './discussion-carousel.component';

describe('DiscussionCarouselComponent', () => {
  let component: DiscussionCarouselComponent;
  let fixture: ComponentFixture<DiscussionCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscussionCarouselComponent]
    });
    fixture = TestBed.createComponent(DiscussionCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
