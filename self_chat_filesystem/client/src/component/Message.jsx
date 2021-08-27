import React from "react";
import styled from "styled-components";

function Message() {
  // { message: { text, user }, name }
  const user = "nahee";
  const name = "nahee";

  let isSentByCurrentUser = false;

  //   공백 제거
  const trimmedName = name.trim().toLowerCase();

  //   user가 현재 유저이면
  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }
  return isSentByCurrentUser ? (
    //   현재 유저이면 이거 리턴
    <Styled.Root isSentByCurrentUser={isSentByCurrentUser}>
      <Styled.Message>이건 나야</Styled.Message>
    </Styled.Root>
  ) : (
    //   아니면 이거 리턴
    <Styled.Root>
      <Styled.Message>안녕 온 걸 환영해</Styled.Message>
      <Styled.Sender>admin</Styled.Sender>
    </Styled.Root>
  );
}

export default Message;

const Styled = {
  Root: styled.div`
    display: flex;
    width: 100%;
    ${({ isSentByCurrentUser }) =>
      isSentByCurrentUser
        ? "justify-content: flex-end"
        : "justify-content: flex-start"}
  `,
  Message: styled.div`
    background: #9c9a9a;
    border-radius: 20px;
    padding: 5px 20px;
    color: white;
    display: inline-block;
    max-width: 80%;
    margin: 5px 5px 5px 5px;
    font-size: 13px;
  `,
  Sender: styled.div`
    display: flex;
    align-items: center;
    font-family: Helvetica;
    color: #1d1d1d;
    margin-left: 5px;
  `,
};
