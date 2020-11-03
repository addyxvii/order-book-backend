import express from 'express';
import io from 'socket.io';
import cors from 'cors'

import { WebsocketClient } from "poloniex-node-api";

require('dotenv').config()

const bittrex = require('node-bittrex-api');
const app = express();
const PORT = 8000;
const socketServer = io(PORT)
const key = process.env.POLONIEX_API_KEY;
const secret = process.env.POLONIEX_API_SECRET;
const channels = ["BTC_ETH"];
const poloniex = new WebsocketClient({ key, secret, channels });

app.get('/', (req, res) => res.send(res.status));

app.use(cors())
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  })


socketServer.on('connect', (socket) => {

  console.log('Socket connected')

  socket.on('fetchPolinexData', () => {

    console.log('client wants polinex data')

    poloniex.connect();
    poloniex.on("open", () => poloniex.subscribe('BTC_ETH'));
    poloniex.on("message", (message) => {
      socket.emit('recievePoloniexData', { message });
    });
  })
  // browser sends the "fetchBittrexData" message, and it is recieved here
  socket.on('fetchBittrexData', () => {

    console.log(`client wants us to fetch bittrex data`)

    // FETCH BITTREX DATA HERE 
    bittrex.websockets.subscribe(['BTC-ETH'], (data: any) => {
      if (data.M === 'updateExchangeState') {
        return data.A.forEach((data_for: any) => {
          socket.emit('recieveBittrexData', { [data_for.MarketName]: data_for });
        });
      }
    });
  });
});

app.listen(process.env.PORT)