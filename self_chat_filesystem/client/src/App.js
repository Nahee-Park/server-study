import React from "react";
import FileSystem from "./workspace/FileSystem.jsx";
import styled from "styled-components";

function App() {
  return (
    <Styled.Root>
      <FileSystem />
    </Styled.Root>
  );
}

export default App;

const Styled = {
  Root: styled.div``,
};
