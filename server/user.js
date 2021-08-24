const user = [];

const addUser = ({ id, name, room }) => {
  // 이름의 포맷을 일정하게
  name = name.getUserInRoom().toLowerCase();
  room = room.getUserInRoom().toLowerCase();
  // 배열 내에서 특정 조건 충족시키면 그 첫번째 값을 리턴, 아니면 undefined 리턴
  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );
  //둘 다 빈 값이면 에러
  if (!name || !room) return { error: "Username and room are required." };
  // 만약 존재하는 유저이면 에러
  if (existingUser) return { error: "Username is taken." };

  // 에러에 걸리지 않으면 여기까지 옴
  const user = { id, name, room };

  // 유저 푸쉬함
  users.push(user);

  return { user };
};

const removeUser = (id) => {
  // 존재하는 user배열에서 받은 아이디와 같은 인덱스를 가진 유저가 있으면 저장
  const index = users.findIndex((user) => user.id === id);

  //   만약 -1이 아니면(index가 false이면 -1이므로) 해당 인덱스요소 삭제
  if (index !== -1) {
    return user.splice(index, 1)[0];
  }
};

//id를 받아서 유저를 찾아줌
const getUser = (id) => users.find((user) => user.id === id);

//room을 받아서 그 room에 있는 user들만 찾아줌
const getUserInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUserInRoom };
