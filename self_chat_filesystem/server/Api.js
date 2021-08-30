const router = require("express").Router();
const Message = require("./model/message");
// user와 error 모델도 들고옴

// 모든 채팅들 찾음
const findChats = async (user) => {
  const pastMessages = [];

  // 자신의 이름으로 Id를 찾아서 그 Id를 바탕으로 메시지 찾을 거임!
  const myId = await user.findOne({ id: user });

  // 자신이 보낸 메시지, 귓속말로 받은 메시지 혹은 수신자가 없는 메시지 전부 찾음
  const chats = await Message.find()
    .or([{ toUser: myId }, { user: myId }, { toUser: { $exists: false } }])
    .populate(["user", "toUser"])
    .sort("createAt");

  // 찾은 메시지들을 위 배열에 저장 후 리턴
  chats.forEach((element) => {
    // toUser가 있으면 아이디 저장, 없으면 그냥 빈 스트링 저장
    const toUserId = element.toUser ? element.toUser.id : "";
    pastMessages.push({
      user: element.user.id,
      toUser: toUserId,
      isPrivate: element.isPrivate,
      text: element.text,
    });
  });
  return pastMessages;
};

// post 요청을 받았을 때 그 메시지를 더함
const addMessage = async (req) => {
  // post로 받은 데이터에서 이름 값을 id로 변환해서 디비에 저장
  const data = req.body;

  const user = await User.findOne({ id: data.user });
  data.user = user._id;

  if (data.toUser) {
    const toUser = await User.findOne({ id: data.toUser });
    data.toUser = toUser._id;
  }

  //DB에 저장
  const isAdd = await Message.create(data);

  return true;
};

router.get("/init", async (req, res, next) => {
  try {
    // req로 들어온 쿼리를 통해 username을 가져와서 채팅들 목록 구함
    const ret = await findChats(req.query.username);
    res.send(ret);
  } catch (err) {
    console.error(err);
  }
});

router.post("/message", async (req, res, next) => {
  try {
    // 들어온 값을 일단 메시지 더하는 곳으로 보냄
    const ret = await addMessage(req);
    res.send(ret);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
