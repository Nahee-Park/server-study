import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { FormGroup, Label, Input, Button } from "reactstrap";

function FileSystem() {
  const [data, setData] = useState({
    uploadFile: "",
    fileList: [],
    selectFile: "",
    contents: "불러올 파일을 선택해주세요",
  });

  // 업로드 할 파일 값 받아오는 함수
  const chooseFile = (e) => {
    const fileInfo = e.target.files[0];
    const fileExt = fileInfo.name.substr(fileInfo.name.length - 3);
    console.log(fileInfo);
    console.log(fileExt);
    if (fileExt === "zip" || fileExt === "tar") {
      console.log("이거 집임");
      setData({ uploadFile: fileInfo, selectFile: "" });
    } else {
      e.target.value = "";
      alert(".zip .tar 확장자의 파일만 업로드 가능합니다");
    }
  };

  // 서버에서 파일 받아오는 함수
  const getFileList = (e) => {
    const file = data.uploadFile;
    const reader = new FileReader();

    //파일리스트 세팅
    reader.onload = async (e) => {
      // zip 풀 수 있도록 하는 생성자
      const zip = require("jszip")();
      const obj = await zip.loadAsync(e.target.result);
      setData({ fileList: Object.values(obj.files) });
    };
    reader.onerror = (e) => {
      alert("file open error");
    };
    reader.readAsArrayBuffer(file);
  };

  // 클릭했을 때 파일 업로드 하는 함수
  const handleUpload = (e) => {
    console.log("업로드 누를 때 업로드 파일 상태", data.uploadFile);
    if (!data.uploadFile) {
      alert("파일을 선택하세요");
      return;
    }
    const formData = new FormData();
    formData.append("file", data.uploadFile);

    //이 파일 포스트
    axios.post("api/file/upload", formData).then(({ data }) => {
      if (data) {
        // 포스트 잘 되면 파일리스트 불러옴
        getFileList(e);
      }
    });
  };

  // 수정한 내용 서버로 저장하는 함수
  const handleSave = (e) => {
    // 선택 파일 있을 때에만 실행
    // 수정한 내용을 post 후 초기화
    if (data.selectFile) {
      axios
        .post("api/file/contents", {
          filename: data.selectFile,
          contents: data.contents,
        })
        .then(() => {
          alert("저장함!");
          setData({
            uploadFile: "",
            contents: "편집할 파일을 선택해주세요",
            selectFile: "",
          });
        });
    }
  };

  // 파일 하나 선택하면, 선택한 파일 서버로 보내는 함수
  const handleFileClick = (name) => {
    setData({ selectFile: name });
    // 파일 이름을 담아서 보내고, 받은 파일을 contentsArea에 가져옴
    axios
      .get("api/file/contents", { params: { filename: name } })
      .then(({ data }) => {
        setData({ contents: data });
      });
  };

  // 수정 내용 set하는 함수
  const handleContentsChange = (e) => {
    setData({ contents: e.target.value });
  };

  // 폴더 누르면 경고 띄울 것
  const handleDirClick = (e) => {
    alert("폴더는 편집할 수 없습니다");
  };
  const fileList =
    data.fileList &&
    data.fileList.map((item, key) => {
      return (
        <li
          onClick={item.dir ? handleDirClick : handleFileClick(item.name)}
        ></li>
      );
    });
  return (
    <Styled.Root>
      <Styled.Buttons>
        <FormGroup>
          <Input
            type="file"
            name="file"
            id="exampleFile"
            onChange={chooseFile}
          />
        </FormGroup>
        <Button outline color="info" onClick={handleUpload}>
          업로드
        </Button>{" "}
      </Styled.Buttons>
      <Styled.FileList>
        <ul>{fileList && fileList}</ul>
      </Styled.FileList>
      <Styled.Edit>
        <FormGroup>
          <Label for="examplecontents">편집 공간</Label>
          <Input
            type="textarea"
            name="text"
            id="exampleText"
            value={data.contents}
            onChange={handleContentsChange}
          />
        </FormGroup>
      </Styled.Edit>
      <Styled.Save>
        <Button outline color="warning" onClick={handleSave}>
          저장
        </Button>{" "}
      </Styled.Save>
    </Styled.Root>
  );
}

export default FileSystem;
const Styled = {
  Root: styled.div`
    width: 75%;
  `,
  Buttons: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  FileList: styled.div`
    height: 100px;
  `,
  Edit: styled.div`
    textarea {
      height: 100px;
      margin-bottom: 10px;
    }
  `,
  Save: styled.div``,
};
