import signalR from '@microsoft/signalr'; 

const hub = ['c3']
const client = new signalR.client('wss://socket-v3.bittrex.com/signalr', hub);
    client.serviceHandlers.messageReceived = messageReceived;
    client.serviceHandlers.connected = () => {
      console.log('Connected');
      return resolve(client)
    }




