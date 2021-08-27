const express = require("express");
// 라이브러리를 바탕으로 객체 설정
const app = express();
let db;
const MongoClient = require("mongodb").MongoClient;
// 뷰 엔진으로 ejs를 쓰겠다는 뜻
app.set("view engine", "ejs");

MongoClient.connect(
  "mongodb+srv://admin:13243543qq@cluster0.3bsm9.mongodb.net/todoapp?retryWrites=true&w=majority",
  (error, client) => {
    // 데이터 연결되면 할 일
    if (error) return console.log(error);

    // db연결
    db = client.db("todoapp");

    // 데이터 들어오면 서버 띄우기 , 외부에서 이 포트로 들어왔을 때 어떤 행위할 지를 알려줌
    app.listen(8080, () => {
      console.log("listening on 8080");
    });
  }
);

// req 풀기 위한 코드 (미들웨어가 요청 받은 것들을 풀어줘야 서버에서 해석 가능)
app.use(express.urlencoded({ extended: true }));

// .sefFile을 통해 파일을 보냄
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// 특정 라우팅 엔드포인트로 들어오면 GET해서 보여주도록
app.get("/pet", (req, res) => {
  res.send("우헤 펫용품 쇼핑할 수 있는 페이지입니다.");
});

// 특정 라우팅 엔드포인트로 들어오면 GET해서 보여주도록
app.get("/write", (req, res) => {
  res.sendFile(__dirname + "/write.html");
});

// post요청을 받을 시 /add로 라우팅되고 콜백함수 내의 내용을 실행
app.post("/add", (req, res) => {
  res.send("전송완료");

  // 총 게시물 갯수를 가지고 콜렉션을 따로 만듦
  db.collection("counter").findOne({ name: "게시물 갯수" }, (error, result) => {
    console.log(result.totalPost);
    // 일단 토탈 포스트 counter 클라스터에서 가져옴
    let postCounter = result.totalPost;

    // 특정 클러스터에 데이터 보내기
    db.collection("post").insertOne(
      {
        _id: postCounter + 1,
        title: req.body.title,
        date: req.body.date,
      },
      (error, result) => {
        // 데이터 보낸 이후에 totalPost 카운트 증가시킴(counter 클러스터는 전역변수 관리하는 용도로 쓰임)
        db.collection("counter").updateOne(
          { name: "게시물 갯수" },
          // $inc totalPost 1 증가시키는 operator 문법
          { $inc: { totalPost: 1 } },
          (error, result) => {
            console.log("수정완료");
          }
        );
        console.log("받은 데이터 저장 완료");
      }
    );
  });
});

// 누가 /list로 접속하면 받은 데이터들을 보여줌
app.get("/list", (req, res) => {
  // 디비에 저장된 post라는 collection 안의 모든 데이터를 꺼내주세요
  db.collection("post")
    .find()
    .toArray((error, result) => {
      // console.log(result);

      // ejs파일은 view 폴더 안에 넣어야 함
      // db에서 찾은 collection을 ejs에 보냄
      res.render("list.ejs", { data: result });
    });
});

// 삭제 코드
app.delete("/delete", (req, res) => {
  // 문자값으로 들어온 것을 정수로 변환
  req.body._id = parseInt(req.body._id);
  console.log(req.body);
  db.collection("post").deleteOne(req.body, (error, result) => {
    console.log("삭제 완료");
  });
  res.send("삭제 완료");
});
