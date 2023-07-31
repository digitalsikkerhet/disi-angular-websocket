export const environment = {
  production: false,
  webSocketUrl: 'wss://localhost:44323',  
  secureRoutes:  [ 'wss://localhost:44323', 'wss://websocket.disi.no' ],
  identityserver:
  {
    authority: 'https://localhost:5001',
    client_id: 'Test_Client_ApiGateway',
    client_secret: 'secret',
    scope: 'openid'
  },
  userManagerSettings: 
  {
    authority: 'https://localhost:5001',
    client_id: '22664EEC-7806-4DA8-9361-F790768C1E73',
    client_secret: 'secret',
    redirect_uri: 'http://localhost:4200/auth-callback',
    post_logout_redirect_uri: 'http://localhost:4200/',
    response_type: "id_token",
    scope: "api",
    filterProtocolClaims: true,
    loadUserInfo: true,
    grant_types_supported: ['client_credentials', 'password']
  } 
};
