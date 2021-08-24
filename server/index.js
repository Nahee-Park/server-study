const express = require("express");
// realtime 통신할 땐 http보다 socket 사용
const socketio = require("socket.io");
const http = require("http");

// 특정 포트 있으면 거기로 아니면 5000번
const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);

// 서버 시작
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
