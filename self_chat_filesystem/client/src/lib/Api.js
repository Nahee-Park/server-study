import axios from "axios";

// const url = "http://localhost:8080/room";

export const getMessages = async () => {
  try {
    // 일단 userData를 받음
    const { userData } = await axios.get("/api/account/id");
    // userData가 들어오면 user에 할당됨
    const user = await fetch(userData);

    const { messageData } = await axios.get(`/api/chat/init?username=${user}`);

    // messageData가 들어오면 pastMessages에 할당됨
    const pastMessages = await fetch(messageData);

    // 리턴 데이터 만들기
    const data = {
      user,
      pastMessages,
    };
    return data;
  } catch (e) {
    console.error("[FAIL]GET MESSAGES", e);
  }
};

export const postMessages = async (nowData) => {
  try {
    const { postData } = await axios.post("/api/chat/message");
    return postData;
  } catch (e) {
    console.error("[FAIL]POST MESSAGES", e);
  }
};
