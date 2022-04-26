require('dotenv').config({
   path: '.env',
});
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const logger = require('morgan');
const socketIo = require('socket.io');
const db = require('./database/connection');
const { event } = require('./event');

const app = express();

db.connect();

app.use(logger('dev'));
app.use(
   bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 5000,
   })
);
app.use(bodyParser.json({ limit: '50mb' }));

const socketServer = http.createServer(app);

const io = socketIo(socketServer, {
   forceNew: true,
   transports: ['websocket'],
   path: '/websocket',
   cors: {
      cors: {
         origin: 'http://localhost:5000',
      },
   },
});

event(io);

socketServer.listen(process.env.SOCKET_PORT || 1000, () => {
   console.log(
      `Started websocket server at http://${process.env.SOCKET_HOST}:${process.env.SOCKET_PORT}/websocket!`
   );
});
