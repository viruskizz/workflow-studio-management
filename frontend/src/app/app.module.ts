import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from "@auth0/angular-jwt";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SharedModule} from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { RootModule } from './modules/root/root.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserDetailComponent } from './modules/user-detail/user-detail.component';
import { UserProfileComponent } from './modules/user-detail/user-profile/user-profile.component';
import { UserInformationComponent } from './modules/user-detail/user-information/user-information.component';

@NgModule({
  declarations: [
    AppComponent,
    UserDetailComponent,
    UserProfileComponent,
    UserInformationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RootModule,
    SharedModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: AuthService.tokenGetter,
        allowedDomains: ["example.com"],
        disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }