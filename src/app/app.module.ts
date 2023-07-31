import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { WebsocketService } from './websocket/services/websocket.service';
import { AppLoadService, loadApp } from './websocket/services/appLoad.service';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';
import { AuthService } from './websocket/services/auth.service';
 

@NgModule({
    declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        FormsModule,
        AuthModule.forRoot({
            config: {
              triggerAuthorizationResultEvent: true,
              authority: environment.identityserver.authority,
              redirectUrl: `${window.location.origin}`,
              postLogoutRedirectUri: `${window.location.origin}`,
              clientId: environment.identityserver.client_id,
              scope: environment.identityserver.scope,
              responseType: 'code',
              silentRenew: false,
              useRefreshToken: false,
              logLevel: LogLevel.Debug,
            },
          }),
    ],
    providers: [ 
        AuthService,
        WebsocketService,
        AppLoadService,
        {
          provide: APP_INITIALIZER,
          useFactory: loadApp,
          //useValue: () => {},
          deps: [AppLoadService],
          multi: true
        }    
    ]
})
export class AppModule { }
