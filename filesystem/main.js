var http = require("http");
var fs = require("fs");
var app = http.createServer(function (request, response) {
  var url = request.url;
  if (request.url == "/") {
    url = "/index.html";
  }
  if (request.url == "/favicon.ico") {
    response.writeHead(404);
    response.end();
    return;
  }
  response.writeHead(200);
  // __dirname은 디렉토리 경로 + url 값
  console.log(__dirname + url);
  //사용자가 접근할 때마다 읽어들여야 할 파일로부터 읽고, 그 값을 가져오고 그것을 response.end에 위치시킴
  // 어떤 코드를 넣느냐에 따라서 사용자에게 전송하는 데이터가 바뀜 -> 사용자에게 전송할 데이터를 생성한다 라는 것이 노드제이에서의 힘
  response.end(fs.readFileSync(__dirname + url));
});
app.listen(3000);
