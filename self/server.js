const express = require("express");
// 로그인, 세션 생성을 위한 라이브러리(passport, passport-local express-session->실제 서비스에선 이거 말고 몽고디비에 세션데이터 저장해주는 라이브러리 이용)
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

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

// 서버의 요청과 응답 사이에 실행할 코드
// 어떤 사람이 로그인 -> 그 사람의 아이디와 비번이 DB에 있는 것과 같은 지 검사 -> 검사 결과가 맞으면 세션 하나 생성해주고 성공 페이지로 이동시키기, 실패하면 실패 페이지로 이동시키기
app.use(
  session({ secret: "비밀코드", resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

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
    // 데이터 삭제한 이후에 totalPost 카운트 감소시킴
    db.collection("counter").updateOne(
      { name: "게시물 갯수" },
      // $inc totalPost 1 증가시키는 operator 문법
      { $dec: { totalPost: 1 } },
      (error, result) => {
        console.log("삭제 후 토탈게시글 갯수 완료");
      }
    );
  });
  res.send("삭제 완료");
});

// /detail1, 2, 3, 4 ... 로 접속하면 detail.ejs 보여줌
app.get("/detail/:id", (req, res) => {
  // id가 1인 걸 찾아와서 그 결과 콘솔창에 출력
  //url의 파라미터 중에 :id를 찾아서 넣어달라는 뜻
  db.collection("post").findOne(
    { _id: parseInt(req.params.id) },
    function (err, result) {
      console.log(result);
      res.render("detail.ejs", { data: result });
    }
  );
});

//사실상 지금 라우팅을 서버 측에서 다 하고 있는 것은
//login페이지 접속 시 login.ejs 페이지 보여주도록
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// login경로로 post시 미들웨어 함수인 passport를 지나 /페이지로 리다이렉트 되도록
app.post(
  "/login",
  passport.authenticate("local", { failureREdirect: "/faiil" }),
  (req, res) => {
    res.redirect("/");
    console.log("로그인 포스트 잘 되었어요");
  }
);

// 어떻게 인증할 건지에 대한 세부 코드
passport.use(
  // LocalStrategy() -> local방식으로 아이디, 비번 겁사 어떻게 할 지 도와주는 부분
  new LocalStrategy(
    //여기가 설정하는 부분
    {
      usernameField: "name", //사용자가 제출한 아이디가 어디 적혔는지
      passwordField: "pw", //사용자가 제출한 비번이 어디 적혔는지
      session: true, //세션 만들 건지
      passReqToCallback: false, //아이디, 비번 말고 다른 정보 검사가 필요한지
    },
    // 아이디 비번 검사하는 코드
    function (inputName, inputPw, done) {
      console.log(inputName, inputPw);
      // 일단 아이디를 키로 해서 찾기 때문에 없으면 에러를 보냄
      db.collection("login").findOne(
        { name: inputName },
        function (err, result) {
          if (err) return done(err);
          if (!result)
            return done(null, false, {
              message: "존재하지않는 아이디 입니다.",
            });
          // 실제 서비스에서는 암호화하는 과정 필요
          if (inputPw == result.pw) {
            return done(null, result);
          } else {
            return done(null, false, { message: "비번 틀렸어요" });
          }
        }
      );
    }
  )
);
// 아이디 비번이 맞으면 1.세션 데이터 만들기 2. 그 안에 포함된 세션 아이디 발급하기 3. 유저한테 보내주기

//유저의 아이디 데이터를 바탕으로 세션 데이터를 만들어 줌 -> 그 세션 데이터의 아이디를 쿠키로 만들어서 사용자의 브라우저로 보내줌
passport.serializeUser(function (user, done) {
  console.log("세션 데이터 만들어주는 중");
  done(null, user.name);
});

// passport.deserializeUser -> 세션 아이디를 바탕으로 이 유저의 정보를 DB에서 찾아달라는 역할을 하는 함수
passport.deserializeUser(function (name, done) {
  db.collection("login").findOne({ name: name }, (err, result) => {
    done(null, result);
  });
});

// 미들웨어용 함수
const isLogin = (req, res, next) => {
  // req.user(deserializeUser가 보내준 로그인한 유저의 DB데이터)가 있으면 next롵 통과, 아니면 에러메시지를 응답해주세요 라는 뜻
  if (req.user) {
    next();
  } else {
    res.send("로그인하지 않으셨습니다.");
  }
};

// /mypage접속 시 이 페이지로 라우팅, 미들웨어 함수를 넣으면 해당 함수를 거쳐서 이 코드가 실행됨
app.get("/mypage", isLogin, (req, res) => {
  console.log("mypage get 잘 되었어요");
  console.log(req.user);
  // 사실상 이런 방식의 라우팅은 라우팅하는 주소로 들어갈 때 서버가 클라로 보낸 데이터가 바로 꽂혀서 들어감 , 그냥 자체 ssr같은 고런 느낌..
  res.render("mypage.ejs", { user: req.user });
});
