const express = require("express");
// realtime 통신할 땐 http보다 socket 사용
const http = require("http");
const socketio = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});
// const cors = require("cors");

const { addUser, removeUser, getUser, getUserInRoom } = require("./user.js");

// 특정 포트 있으면 거기로 아니면 5000번
const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// app.use(cors());
// realtime connection & disconnection
// 모든 소켓 관련 함수들은 여기 안에 넣어줌
io.on("connection", (socket) => {
  console.log("we have a new connectio!");

  // "join"이라는 이벤트가 들어오면 실행할 아이들
  // 콜백함수 설정 가능 -> 클라이언트에게 해당 콜백함수를 넘겨줌
  socket.on("join", ({ name, room }, callback) => {
    console.log(name, room);
    // addUser()는 error or user를 리턴
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) {
      callback({ error: "error" });
    }

    // 모두에게 보내는 메시지
    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room ${user.room}`,
    });

    // 특정 룸으로만 보내는 메시지
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name}, has joined` });

    // .join메소드 -> 유저를 룸에 포함시킴
    socket.join(user.room);

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    // 프론트에서 메시지 보낸 이후에 무언가를 할 수 있도록
    callback();
  });
  socket.on("disconnect", () => {
    console.log("User had left!!");
  });
});

app.use(router);

// 서버 시작
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
