import { Component } from '@angular/core';

@Component({
    templateUrl: './checkoutform.component.html',
})
export class CheckoutFormComponent {

    quantities: number[] = [1, 1, 1];

    value = '';

    checked = true;

    checked2 = true;

    cities = [
        { name: 'USA / New York', code: 'NY' },
        { name: 'Italy / Rome', code: 'RM' },
        { name: 'United Kingdoom / London', code: 'LDN' },
        { name: 'Turkey / Istanbul', code: 'IST' },
        { name: 'France / Paris', code: 'PRS' }
    ];

    selectedCity = '';

}
