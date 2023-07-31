export enum WebsocketMessageType {
    UNKNOWN = 0,
    AUTHENTICATE = 1,
    AUTHENTICATED = 2,
    CLOSED = 3,
    ERROR = 4,
    MESSAGE = 5,
}


export interface WebsocketMessage {
    messageType: string;
    message: any;
    accessToken?: string;
    idToken?: string;    
}
