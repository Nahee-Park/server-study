import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";

import "./Chat.css";

const ENDPOINT = "localhost:5000";

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    //   쿼리 스트링으로 받은 name, room 저장
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);

    // emit 메소드를 통해 특정 이벤트를 백엔드로 보냄 -> 이 이벤트 발생했을 때 돌아오는 것은 백엔드 쪽에서 콜백으롤 보낸 애들
    socket.emit("join", { name: name, room: room }, (error) => {
      if (error) {
        alert(error);
      }
    });
    // 언마운트 될 때, 업데이트 되기 직전에
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
    // deps 생략하면 컴포넌트 리렌더링 될 때마다 useEffect함수 호출
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    // message 이벤트를 보냄
    socket.on(
      "message",
      (message) => {
        // 메시지 받아서 set한 아이로
        setMessages((messages) => [...messages, message]);
      },
      [messages]
    );

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    // 기본 이벤트에 웹페이지를 refresh시키는 것이 있어서 그걸 막아줌
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  console.log(message);

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
