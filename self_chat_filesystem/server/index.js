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
const MongoClient = require("mongodb").MongoClient;

// 정적 파일을 업로드 하기 위한 가상의 경로를 /public에 넣음
app.use("/public", express.static("public"));

let db;
MongoClient.connect(
  "mongodb+srv://admin:13243543qq@cluster0.3bsm9.mongodb.net/chatDB?retryWrites=true&w=majority",
  { useUnifiedTopology: true },
  (error, client) => {
    if (error) return console.log(error);
    db = client.db("chatDB");

    http.listen(8080, () => {
      console.log("listening on 8080");
    });
  }
);

// socket에 연결을 하면 일어날 일들
io.on("connection", (socket) => {
  console.log("연결 되었어요");

  socket.on("message", (data) => {
    console.log("첫 메시지 왔어요");
    console.log(data);
    io.emit("allMessage", data);
  });
});

var roomName = "dqeqfqaquqlqtq기q본q방qroom";
app.post("/room", (req, res) => {
  res.send(req.body);
  // 채팅방 이름 저장해두기 -> 나중에 쓸 거임
  roomName = "/" + req.body.room.data;

  //받은 room이 없는 방이면 db에 새로 추가
  db.collection("chat")
    .find({ room: req.body.room })
    .toArray((error, result) => {
      if (result.length === 0) {
        db.collection("chat").insertOne(
          { room: req.body.room, user: [req.body.user] },
          (err, result) => {
            console.log("저장됨!");
          }
        );
      }
    });

  //이 채팅방의 user를 점검해서 req.body.user가 없다면 추가
  db.collection("chat")
    .find({ room: req.body.room })
    .toArray((error, result) => {
      //   console.log(result[0].user);
      const prevusers = result[0].user;
      let isUserHere = false;
      prevusers.forEach((element) => {
        if (element == req.body.user) {
          isUserHere = true;
        }
      });
      // user가 없으면 새로운 유저 push
      !isUserHere &&
        db
          .collection("chat")
          .update({ room: req.body.room }, { $push: { user: req.body.user } });
    });
});

const chatRoom = io.of(roomName);
chatRoom.on("connection", (socket) => {
  console.log("방에 연결 되었어요");
  socket.on("message", (data) => {
    console.log("방으로 첫 메시지 왔어요");
    console.log(data);
    socket.emit("allMessage", data);
  });
});

// 서버에서 해당 방의 참여자 보여줌
app.get("/users", (req, res) => {
  db.collection("chat")
    .find()
    .toArray((err, result) => {
      res.send(result);
      console.log(result);
    });
});
