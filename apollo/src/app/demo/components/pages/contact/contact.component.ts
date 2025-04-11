import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './contact.component.html',
})
export class ContactComponent {
    options: any;

    overlays: any[] = [];

    dialogVisible = false;

    markerTitle = '';

    selectedPosition: any;

    infoWindow: any;

    draggable = false;

    name = '';

    email = '';

    message = '';

    content: any[] = [
        { icon: 'pi pi-fw pi-phone', title: 'Phone', info: '1 (833) 597-7538' },
        {
            icon: 'pi pi-fw pi-map-marker',
            title: 'Our Head Office',
            info: 'Churchill-laan 16 II, 1052 CD, Amsterdam',
        },
        { icon: 'pi pi-fw pi-print', title: 'Fax', info: '3 (833) 297-1548' },
    ];

    constructor(private layoutService: LayoutService) {}

    get mapStyle() {
        return {
            'background-image':
                this.layoutService.config().colorScheme === 'light'
                    ? "url('assets/demo/images/contact/map-light.svg')"
                    : "url('assets/demo/images/contact/map-dark.svg')",
        };
    }
}
