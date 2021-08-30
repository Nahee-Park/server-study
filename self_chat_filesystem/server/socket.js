const express = require("express");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin:13243543qq@cluster0.3bsm9.mongodb.net/chatDB?retryWrites=true&w=majority"
);

// 소켓 연결
io.on("connection", (socket) => {
  console.log("접속하셨습니다");

  // 접속 유저를 담음
  const userList = [];

  // 소켓 연결 끊기면 나가고 userList에서 삭제
  socket.on("disconnect", () => {
    socket.leave(userId);

    // userList에서 삭제
    for (let i in user) {
      if (userList[i].username === userId) {
        userList.splice(i, 1);
      }
    }

    // userList를 얻는 이벤트를 보냄
    io.emit("getUserList", userList);
    console.log("클라이언트 접속 해제");
  });

  // 소켓 연결 에러
  socket.on("error", (error) => {
    console.error(error);
  });

  // 전체 채팅 -> toUser가 있으면 귓속말이므로 해당 소켓의 아이디를 가진 사람에게만 전달
  socket.on("toMessage", (data) => {
    // 기본적으로 한 화면에 뿌려지므로 fromMessage이벤트로 통일
    //   toUser가 있으면 귓속말 버전으로 방출(소켓 아이디로 만든 룸에 보냄)
    if (data.toUser) {
      io.to(toSocketId).emit("fromMessage", data);
      io.to(socket.id).emit("fromMessage", data);
    } else {
      // 없으면 그냥 온 메시지들 방출
      io.emit("fromMessage", data);
    }
  });

  // 방에 들어오면 실행
  socket.on("enterRoom", (data) => {
    // 데이터 필드의 내용 : username, socketId, toUser
    userId = data.username;
    // 소켓 아이디 부여
    data.socketId = socket.id;
    userList.push(data);

    // username을 방에 조인시킴
    socket.join(data.username);

    io.emit("getUserList", userList);
  });
});
