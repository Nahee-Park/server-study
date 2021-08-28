const express = require("express");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
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
});
