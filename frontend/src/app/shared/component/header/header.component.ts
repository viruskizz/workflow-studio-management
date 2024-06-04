import { Component, Input, OnInit } from '@angular/core';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit {
    username = 'Plaimee';
    imageUrl = 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg';

    ngOnInit() {
    
    }
}