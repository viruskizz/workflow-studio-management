import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-td-team-name',
  templateUrl: './td-name.component.html',
  styleUrl: './td-name.component.css'
})
export class TdNameRowComponent {

    @Input() teamIcon = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
    @Input() teamName = "default name";
}
