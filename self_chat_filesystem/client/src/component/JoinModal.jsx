import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { postRoom } from "../lib/Api";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";

function Join({ modal, toggle, setModal, user }) {
  const [room, setRoom] = useState("");
  const joinRoom = async () => {
    setModal(!Modal);
    // 서버로 Room post 하는 코드
    const data = await postRoom(room, user);
    console.log(data);
  };

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
          <Input
            placeholder="채팅방 이름을 입력하세요"
            rows={5}
            onChange={(e) => setRoom(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={joinRoom}>
            Join
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Join;
