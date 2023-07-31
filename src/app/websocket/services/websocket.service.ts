import { Injectable, OnDestroy } from "@angular/core";
import { environment } from "src/environments/environment";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";
import { WebsocketMessage, WebsocketMessageType } from "../dtos";

@Injectable()
export class WebsocketService implements OnDestroy {
  public messageCallback!: any;
  private webSocket!: WebSocket;
  private checkAuthSubscription!: Subscription;

  constructor(private authService: AuthService) {}

  /**
   * init
   */
  public init() {
    this.checkAuthSubscription = this.authService.isAuthenticated.subscribe(isAuthenticated => {
      if(isAuthenticated) {
        this.initWebSocket();
      } else {
        this.closeWebSocket('Logged out');
      }
    });
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy(): void {
    if(this.checkAuthSubscription) {
      this.checkAuthSubscription.unsubscribe();
    }
    this.closeWebSocket('Destroyed');
  }

  /**
   * initWebSocket
   */
  private initWebSocket(): void {
    this.webSocket = new WebSocket(`${environment.webSocketUrl}`);
    this.webSocket.addEventListener("error", err => {
      this.receiveMessage({ messageType: WebsocketMessageType[WebsocketMessageType.ERROR], message: err } as WebsocketMessage);      
    });
    this.webSocket.addEventListener("message", event => {
      const messageType = JSON.parse(event.data).MessageType;
      this.receiveMessage({ messageType: messageType, message: event.data } as WebsocketMessage);      
    });
    this.webSocket.addEventListener("ping", event => {
      console.log("ping", event);
    });
    this.webSocket.addEventListener("pong", event => {
      console.log("pong", event);
    });
    this.webSocket.addEventListener("open", event => {
      this.authenticateConnection();
    });
    this.webSocket.addEventListener("close", evt => {
      this.receiveMessage({ messageType: WebsocketMessageType[WebsocketMessageType.CLOSED], message: evt.reason } as WebsocketMessage);
    });
  }

  /**
   * closeWebSocket
   */
  private closeWebSocket(reason: string): void {
    if(this.webSocket) {
      this.webSocket.close(0, reason);
    }
  }

  /**
   * sendMessage
   */
  public sendMessage(websocketMessageType: WebsocketMessageType, websocketMessageBody: any): void {
    const websocketMessage = {
      messageType: WebsocketMessageType[websocketMessageType],
      message: websocketMessageBody
    } as WebsocketMessage;

    //--- Pass token to message ---
    if(websocketMessageType !== WebsocketMessageType.AUTHENTICATE) {
      websocketMessage.accessToken = this.authService.accessToken;
      websocketMessage.idToken = this.authService.idToken;
    }

    this.webSocket.send(JSON.stringify(websocketMessage));
  }

  /**
   * Receive message from backend API
   * @param websocketMessage received message
   */
  public receiveMessage(websocketMessage: WebsocketMessage): void {
    const messageType = WebsocketMessageType[websocketMessage.messageType as keyof typeof WebsocketMessageType];
    switch(messageType)
    {
      case WebsocketMessageType.UNKNOWN:
        console.error("Unknown message received:", websocketMessage.message);
        break;
      case WebsocketMessageType.AUTHENTICATED:
        this.debugLog("Connection is authenticated");
        break;    
      case WebsocketMessageType.MESSAGE:
        console.log("message", websocketMessage.message);
        break;
      case WebsocketMessageType.CLOSED:
        this.debugLog('Websocket closed.');
        break;
      case WebsocketMessageType.ERROR:
        console.error("Websocket error:", websocketMessage.message);
        break;  
      default:
        this.debugLog('Unknown message received:' + websocketMessage);
        break;  
    }
    if(this.messageCallback) {
      this.messageCallback(websocketMessage);
    }
  }

  /**
   * Authenticate that the connection belongs to a valid user session
   */
  private authenticateConnection(): void {
    this.debugLog("Requesting authentication");
    this.sendMessage(WebsocketMessageType.AUTHENTICATE, {AccessToken: this.authService.accessToken, idToken: this.authService.idToken});
  }

 
  /**
   * Log if debugging
   * @param message 
   */
  private debugLog(message: string): void {
    console.log(message);
  }

}
