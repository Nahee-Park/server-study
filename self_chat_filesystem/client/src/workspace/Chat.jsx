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
  // 맨 처음 접속했을 때 기본적으로 가질 state
  // user, toUser, toSocketId, isPrivate, text, userList, 로그는 뭐하는 애지
  const [data, setData] = useState({
    user: "nahee",
    toUser: "",
    toSocketId: "",
    isPrivate: false,
    text: "",
    userList: [],
    pastMessages: [],
  });

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
    socket.on("getUserList", (arr) => {
      setData({ userList: arr });
    });

    // get요청으로 1.user 받기 2. pastMessages 받기 3. 그 요청들 이후 서버의 userList 갱신을 위한 enterRoom 이벤트 보내기

    //모든 메시지들 받아옴
    socket.on("fromMessage", (obj) => {
      const temp = data.pastMessages;
      temp.push(obj);

      setData({ pastMessages: temp });
    });
  }, []);

  // 메시지 세팅
  const setMessages = (e) => {
    setData({ message: e.target.value });
  };

  // 엔터 누르면 메시지 보내도록
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };
  // 클릭시 메시지 보냄
  const sendMessage = (e) => {
    e.preventDefault();

    const nowData = {
      user: data.user,
      isPrivate: data.isPrivate,
      text: data.text,
    };

    // 받을 사람 클릭한 상태이면 toUser추가
    if (data.toUser) {
      nowData.toUser = data.toUser;
    }

    // 궁금사항) 꼭 데이터 post한 이후에 저게 이뤄질 필요가 있나?
    // 메시지 데이터 post

    // post 한 이후 귓속말이면 nowData에 socket ID추가

    // 현재 상태 toMessage이벤트로 emit

    // 초기화

    // 에러 잡기
  };

  // 참여자 클릭하면 그 참여자 이름 toUser에 저장
  const joinPrivate = (e) => {
    console.log(e.target.name);
    if (e.target.name === data.user) {
      alert("자신에게는 귓속말을 보낼 수 없습니다!");
    } else {
      setData({
        isPrivate: true,
        toUser: e.target.name,
        toSocketId: e.target.name.socketId,
      });
    }
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
            {/* userList map시킬 것*/}
            {/* userList map시킬 것 -> 첫번째 유저는 아예 따로 테그 빼서 스타일링 다르게 주면 좋을듯*/}
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
              {/* data.pastMessages에서 가져와서 돌릴 것*/}
              {messageList &&
                messageList.map((prevMessage, key) => {
                  return <Message key={key} prevMessage={prevMessage} />;
                })}
            </div>
          </Styled.ChatBoxes>
          <InputGroup>
            <Input
              placeholder="전송할 메시지를 적어주세요"
              value={data.text}
              onChange={setMessages}
              onKeyPress={handleKeyPress}
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
