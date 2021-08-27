import React, { useState } from "react";
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

function Chat() {
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
            <UncontrolledDropdown inNavbar>
              <DropdownToggle nav caret>
                참여자
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>참여자1</DropdownItem>
                <DropdownItem>참여자2</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            {/* 메시지 내용 들어오면 map시킬 것 */}
          </Styled.ChatBoxes>
          <InputGroup>
            <Input placeholder="전송할 메시지를 적어주세요" />
            <InputGroupAddon addonType="append">
              <Button color="secondary">전송</Button>
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
  `,
  ChatBoxes: styled.div`
    height: 613px;
    background-color: aliceblue;
  `,
};
