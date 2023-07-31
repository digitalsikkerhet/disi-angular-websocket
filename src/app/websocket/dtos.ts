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

export enum OidcProvider {
    local = 0,
    facebook = 1,
    google = 2,
    apple = 3,
    microsoft = 4
  }

export interface TokenResponse
{
    provider: OidcProvider;
    userToken: string;
    isSuccess: boolean;
    statusCode: number; 
}
