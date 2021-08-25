const express = require("express");
// realtime 통신할 땐 http보다 socket 사용
const http = require("http");
const socketio = require("socket.io");
// const cors = require("cors");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./user.js");

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

    //딱 들어왔을 때 roomData를 방출 -> user의 room 정보랑, 그 방에 있는 유저들 정보
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    // 메시지 보낼 때 방출할 데이터들의 이벤트 명과 데이터들
    io.to(user.room).emit("message", { user: user.name, text: message });
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    // 프론트에서 메시지  보낸 이후에 무언가를 할 수 있도록
    callback();
  });

  // 연결 끊겼을 때
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left`,
      });
    }
  });
});

app.use(router);

// 서버 시작
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
