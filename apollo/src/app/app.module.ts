import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './services/auth.service';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects, AppReducer } from './store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    AppLayoutModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: AuthService.tokenGetter,
        allowedDomains: ["example.com"],
        disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    LoadingBarModule,
    StoreModule.forRoot(AppReducer, {}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Optional: Limit the number of actions in the history
      logOnly: false, // Optional: Disable in production
    }),
    EffectsModule.forRoot(AppEffects),
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
