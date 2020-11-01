import express from 'express';
import socket from 'socket.io';

const io = require('socket.io-client')
const app = express();
const PORT = 8000;
app.get('/', (req,res) => res.send('Express + TypeScript Server'));
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});