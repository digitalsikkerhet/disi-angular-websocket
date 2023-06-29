import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { WebsocketService } from './websocket/services/websocket.service';
import { AppLoadService, loadApp } from './websocket/services/appLoad.service';
 

@NgModule({
    declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        FormsModule
    ],
    providers: [ 
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
