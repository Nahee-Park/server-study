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
} from "reactstrap";
import styled from "styled-components";

function Chat() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  return (
    <Styled.Root>
      <Styled.ChatWrapper>
        <Styled.ChatRooms>
          {/* 각각 채팅방 들어오면 map시킬 것 */}
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
  `,
  ChatSpace: styled.div`
    width: 70%;
  `,
  ChatBoxes: styled.div`
    height: 613px;
    background-color: aliceblue;
  `,
};
