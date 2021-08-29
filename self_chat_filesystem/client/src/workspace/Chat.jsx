import React, { useState, useEffect } from "react";
import Message from "../component/Message";
import {
  InputGroup,
  InputGroupAddon,
  Button,
  Input,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import styled from "styled-components";
import io from "socket.io-client";

const ENDPOINT = "localhost:8080";
let socket;

function Chat() {
  const user = "nahee";
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [completeRoom, setCompleteRoom] = useState(
    "dqeqfqaquqlqtq기q본q방qroom"
  );
  const [users, setUsers] = useState([]);
  const [data, setData] = useState();
  // let messageList = [];

  // 메시지 세팅
  const setMessages = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("message", message, () => {
        setMessage("");
      });
    }
  };

  // data로 유저리스트를 받았을 때 현재 유저를 가장 위로 올 수 있도록 하는 함수
  const getUserArray = (data) => {
    let tempUsers = [];
    let realUsers = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].room === completeRoom) {
        tempUsers = data[i].user;
        // setUsers(data[i].user);
      }
    }
    let i = 1;
    // 현재 유저를 가장 위로 저장하고 나머지는 그 밑으로 오도록
    tempUsers.forEach((element) => {
      if (element === user) {
        realUsers[0] = element;
      } else {
        realUsers[i] = element;
        i += 1;
      }
    });
    setUsers(realUsers);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on("allMessage", (data) => {
      console.log(data);
      setMessageList([...messageList, data]);
    });
    console.log(messageList);
    console.log(users);
  }, [messageList, completeRoom]);
  console.log(users);

  const joinPrivate = (e) => {
    // 참여자를 클릭하면 그 참여자 이름으로 private room만들기
    console.log(e.target.name);
    socket.emit("private", e.target.name);
  };

  return (
    <Styled.Root>
      <Styled.ChatWrapper>
        <Styled.ChatRooms>
          <div className="room_title">
            <h4>참여자 목록</h4>
          </div>
          <div className="room_list">
            {/* 각각 채팅방 들어오면 map시킬 것 */}
            <ListGroup>
              {users &&
                users.map((user, key) => {
                  return (
                    <ListGroupItem
                      onClick={joinPrivate}
                      key={key}
                      tag="a"
                      href="#"
                      action
                      name={user}
                    >
                      {user}
                    </ListGroupItem>
                  );
                })}
            </ListGroup>
          </div>
        </Styled.ChatRooms>
        <Styled.ChatSpace>
          <Styled.ChatBoxes>
            <div className="chat__contents">
              {messageList &&
                messageList.map((prevMessage, key) => {
                  return <Message key={key} prevMessage={prevMessage} />;
                })}
            </div>
          </Styled.ChatBoxes>
          <InputGroup>
            <Input
              placeholder="전송할 메시지를 적어주세요"
              value={message}
              onChange={setMessages}
            />
            <InputGroupAddon addonType="append">
              <Button color="secondary" onClick={sendMessage}>
                전송
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Styled.ChatSpace>
      </Styled.ChatWrapper>
    </Styled.Root>
  );
}

export default Chat;

const Styled = {
  Root: styled.div`
    width: 50%;
  `,
  ChatWrapper: styled.div`
    width: 700px;
    height: 650px;
    display: flex;
  `,
  ChatRooms: styled.div`
    width: 30%;
    height: 100%;
    background-color: beige;
    .room {
      &_title {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      &_list {
        height: 94%;
        overflow-y: scroll;
      }
    }
  `,
  ChatSpace: styled.div`
    width: 70%;
    .chat {
      &__btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  `,
  ChatBoxes: styled.div`
    height: 613px;
    background-color: aliceblue;
  `,
};
