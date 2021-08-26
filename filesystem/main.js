var http = require("http");
var fs = require("fs");
var url = require("url");
var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  console.log(queryData);
  if (_url == "/") {
    _url = "/index.html";
  }
  if (_url == "/favicon.ico") {
    response.writeHead(404);
    response.end();
    return;
  }
  response.writeHead(200);

  //사용자가 접근할 때마다 읽어들여야 할 파일로부터 읽고, 그 값을 가져오고 그것을 response.end에 위치시킴
  // 어떤 코드를 넣느냐에 따라서 사용자에게 전송하는 데이터가 바뀜 -> 사용자에게 전송할 데이터를 생성한다 라는 것이 노드제이에서의 힘
  response.end(queryData.id);
});

// 3000포트에 서버 띄운다는 뜻
// 포트 번호 생략하면 디폴트로 80번
app.listen(3000);

// 쿼리 스트링을 통해 읽고 싶은 정보를 전달
