import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-industry-card',
  templateUrl: './industry-card.component.html',
  styleUrls: ['./industry-card.component.scss']
})
export class IndustryCardComponent {
  @Input() src = '';
}
