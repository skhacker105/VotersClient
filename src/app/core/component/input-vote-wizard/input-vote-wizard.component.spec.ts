import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputVoteWizardComponent } from './input-vote-wizard..component';


describe('InputVoteWizardComponent', () => {
  let component: InputVoteWizardComponent;
  let fixture: ComponentFixture<InputVoteWizardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputVoteWizardComponent]
    });
    fixture = TestBed.createComponent(InputVoteWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
