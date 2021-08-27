import React from "react";
import Chat from "./workspace/Chat.jsx";
import FileSystem from "./workspace/FileSystem.jsx";
import styled from "styled-components";

function App() {
  return (
    <Styled.Root>
      <Chat />
      <FileSystem />
    </Styled.Root>
  );
}

export default App;

const Styled = {
  Root: styled.div`
    /* display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%; */
  `,
};
