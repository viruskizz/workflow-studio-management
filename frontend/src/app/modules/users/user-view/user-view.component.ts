import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css'
})
export class UserViewComponent implements AfterViewInit, OnChanges {
  @Input() isShow = false;
  @ViewChild('userModal') userModal?: ElementRef;

  constructor() {}

  ngAfterViewInit() {
    console.log(this.userModal);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isShow']) {
      this.userModal?.nativeElement.showModal();
    }
  }
}
