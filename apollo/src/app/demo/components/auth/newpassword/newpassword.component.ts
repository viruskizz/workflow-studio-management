import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './newpassword.component.html',
})
export class NewPasswordComponent {
    rememberMe = false;

    constructor(private layoutService: LayoutService) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }
}
