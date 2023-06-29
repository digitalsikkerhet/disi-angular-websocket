import { AfterViewInit, Component } from '@angular/core';
import { WebsocketService } from './websocket/services/websocket.service';
import { WebsocketMessage, WebsocketMessageType } from './websocket/dtos';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'disi-angular-websocket';  
  public messageToSend: string = 'Message to send...'
  public receivedMessages: string[] = []; 

  constructor(private websocketService: WebsocketService) {
    websocketService.messageCallback = this.receiveMessage.bind(this);
  }


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
