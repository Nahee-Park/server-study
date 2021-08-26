const express = require("express");
// 라이브러리를 바탕으로 객체 설정
const app = express();

// req 풀기 위한 코드
app.use(express.urlencoded({ extended: true }));

// 서버 띄우기 , 외부에서 이 포트로 들어왔을 때 어떤 행위할 지를 알려줌
app.listen(8080, () => {
  console.log("listening on 8080");
});

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
  // 클라로부터 받은 값은 req에 저장되어 있음 -> 이걸 풀기 위해선 express의 메소드를 이용해야함
  console.log(req.body.title);
  res.send("전송완료");
});
