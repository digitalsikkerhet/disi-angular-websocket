import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { TokenResponse, WebsocketMessage, WebsocketMessageType } from "../dtos";

@Injectable()
export class WebsocketService {
  public messageCallback!: any;
  private webSocket!: WebSocket;

  public init() {
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
   * sendMessage
   */
  public sendMessage(websocketMessageType: WebsocketMessageType, websocketMessageBody: any): void {
    const websocketMessage = {
      messageType: WebsocketMessageType[websocketMessageType],
      message: websocketMessageBody
    } as WebsocketMessage;

    //--- Add token to message ---
    if(websocketMessageType !== WebsocketMessageType.AUTHENTICATE) {
      websocketMessage.encodedJwtToken = this.getEncodedJwtToken().userToken;
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
    localStorage.setItem('SessionId', 'e08187e3-8f8c-4dc0-a0a3-fb4df916023a');
    this.sendMessage(WebsocketMessageType.AUTHENTICATE, {SessionId: this.getSessionId()});
  }


  /**
   * getEncodedJwtToken
   */
  private getEncodedJwtToken(): TokenResponse {
    var token = {} as TokenResponse;
    try {
        const currentToken = localStorage.getItem('EncodedJwtToken');
        token = currentToken ? JSON.parse(currentToken): {} as TokenResponse;
    } catch (ex) {
        console.error(ex);
    }
    return token;
  }  

  /**
   * getSessionId
   */
  private getSessionId(): string | undefined {
    return localStorage.getItem('SessionId') ?? undefined;
  } 
  
  /**
   * Log if debugging
   * @param message 
   */
  private debugLog(message: string): void {
    if(!environment.production) {
      console.log(message);
    }
  }

}
