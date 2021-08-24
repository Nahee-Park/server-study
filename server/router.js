// 라우터레벨에서 미들웨어 express를 사용 - next()는 이번 라우터가 아닌 다음 라우터로 넘겨서 판단함을 의미함
const express = require("express");
const router = express.Router();

// /엔드포인트에 대해서 응답
router.get("/", (req, res) => {
  res.send("server is up and running");
});

// export하는 방식
module.exports = router;
