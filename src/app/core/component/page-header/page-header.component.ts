import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  @Input() display: string | undefined = '';
  @Input() color: string | undefined = '';
  @Input() needSpacer = true;
}
