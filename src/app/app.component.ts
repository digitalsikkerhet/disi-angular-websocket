import { Component } from '@angular/core';
import { WebsocketService } from './websocket/services/websocket.service';
import { WebsocketMessage, WebsocketMessageType } from './websocket/dtos';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AuthService } from './websocket/services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'disi-angular-websocket';  


  //--- Websocket properies ---
  public messageToSend: string = 'Message to send...'
  public receivedMessages: string[] = []; 

  /**
   * Constructor
   */
  constructor(public authService: AuthService, private websocketService: WebsocketService) {
    websocketService.messageCallback = this.receiveMessage.bind(this);
  }
  
  /**
   * sendMessage
   */
  public sendMessage(): void {
    this.websocketService.sendMessage(WebsocketMessageType.MESSAGE, { Action: 'Whateveryouwant', Id: 123, Value:"abc"});
  }

  /**
   * Receive message from backend API
   * @param websocketMessage received message
   */
  public receiveMessage(websocketMessage: WebsocketMessage): void {
    this.receivedMessages.push(JSON.stringify(websocketMessage));
  }

}
