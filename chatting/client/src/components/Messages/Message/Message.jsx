import React from "react";

import "./Message.css";

import ReactEmoji from "react-emoji";

// message의 데이터 형태는 text와 user로 이뤄져 있음(두 값이 있는 객체)
const Message = ({ message: { text, user }, name }) => {
  let isSentByCurrentUser = false;

  //   공백 제거
  const trimmedName = name.trim().toLowerCase();

  //   user가 현재 유저이면
  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    //   현재 유저로부터 온 내용이면 이 내용 랜더
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{trimmedName}</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
      </div>
    </div>
  ) : (
    //   아니면 이 내용 렌더
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
      </div>
      <p className="sentText pl-10 ">{user}</p>
    </div>
  );
};

export default Message;
