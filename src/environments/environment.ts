export const environment = {
  production: false,
  webSocketUrl: 'wss://localhost:44323',  
  secureRoutes:  [ 'wss://localhost:44323' ],
  identityserver:
  {
    authority: 'https://localhost:5001',
    client_id: 'Test_Client_ApiGateway',
    scope: 'openid'
  } 
};
