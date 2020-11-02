import io from 'socket.io-client'; 

const socket = io.connect('wss://api.bittrex.com/v3/markets/ETH-BTC/orderbook?depth=25', {
    reconnectionDelayMax: 1000,
});

socket.on('connect', () => {
    console.log('connected');
});





