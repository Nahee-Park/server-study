import React from "react";
import axios from "axios";

const url = "http://localhost:8080/room";

export const postRoom = async (room, user) => {
  try {
    const data = await axios.post(`${url}`, {
      room: `${room}`,
      user: `${user}`,
    });
    console.log(data);
    return data;
  } catch (e) {
    console.error("[FAIL] POST ANSWER", e);
    return e;
  }
};
