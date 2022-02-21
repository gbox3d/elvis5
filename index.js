import express from 'express'
import dotenv from "dotenv"
import http from 'http'
import fs from 'fs-ext'
import SocketIO from "socket.io";

// console.log(SocketIO_version);
dotenv.config({ path: '.env' }); //환경 변수에 등록 
console.log(`run mode : ${process.env.NODE_ENV}`);

const app = express()

app.use('/', express.static(`./public`));
app.use('/threejs', express.static(process.env.THREEJS_PATH));

//순서 주의 맨 마지막에 나온다.
app.all('*', (req, res) => {
  res
    .status(404)
    .send('oops! resource not found')
});

const httpServer = http.createServer(app)

//socket io
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {

  const io = wsServer;

  console.log('connected', socket.id, socket.handshake.address);

});

httpServer.listen(process.env.PORT, () => {
  console.log(`server run at : ${process.env.PORT}`)
});