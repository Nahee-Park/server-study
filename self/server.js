const express = require("express");
// 라이브러리를 바탕으로 객체 설정
const app = express();

// 서버 띄우기 , 외부에서 이 포트로 들어왔을 때 어떤 행위할 지를 알려줌
app.listen(8080, function () {
  console.log("listening on 8080");
});

// 특정 라우팅 엔드포인트로 들어오면 GET해서 보여주도록
app.get("/pet", function (req, res) {
  res.send("펫용품 쇼핑할 수 있는 페이지입니다.");
});
