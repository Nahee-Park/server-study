import React, { useState, useEffect } from "react";
import Message from "../component/Message";
import JoinModal from "../component/JoinModal";
import {
  InputGroup,
  InputGroupAddon,
  Button,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
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

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on("allMessage", (data) => {
      console.log(data);
      setMessageList([...messageList, data]);
    });
  }, [messageList]);

  return (
    <Styled.Root>
      <Styled.ChatWrapper>
        <Styled.ChatRooms>
          <div className="room_title">
            <h4>채팅방 목록</h4>
          </div>
          <div className="room_list">
            {/* 각각 채팅방 들어오면 map시킬 것 */}
            <ListGroup>
              <ListGroupItem tag="a" href="#" action>
                Cras justo odio
              </ListGroupItem>
            </ListGroup>
          </div>
        </Styled.ChatRooms>
        <Styled.ChatSpace>
          <Styled.ChatBoxes>
            <div className="chat__btns">
              <UncontrolledDropdown inNavbar>
                <DropdownToggle nav caret>
                  참여자
                </DropdownToggle>
                <DropdownMenu right>
                  {/* map돌릴 건데 디폴트는 admin */}
                  <DropdownItem>참여자1</DropdownItem>
                  <DropdownItem>참여자2</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <Button outline color="success" onClick={toggle}>
                Join Room
              </Button>
            </div>
            <div className="chat__contents">
              <JoinModal
                modal={modal}
                toggle={toggle}
                setModal={setModal}
                user={user}
              />
              {messageList &&
                messageList.map((prevMessage) => {
                  return <Message prevMessage={prevMessage} />;
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
        justify-content: space-between;
      }
      &__contents {
        height: 95%;
        overflow-y: scroll;
      }
    }
  `,
  ChatBoxes: styled.div`
    height: 613px;
    background-color: aliceblue;
  `,
};
