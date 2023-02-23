//room-test = b675b85c-407e-493f-a8da-9c9c222164d8
export const checkRoom = (idRoom: string) => (
  fetch(`/api/check-room/${idRoom}`, { method: "GET" })
    .then<CheckRoomResponse>(res => res.json())
);

export const checkPlayerRoom = (idPlayer: string) => (
  fetch(`/api/check-player-room/${idPlayer}`, { method: "GET" })
    .then<{ isInRoom: boolean, idRoom?: string }>(res => res.json())
);

export const createRoom = (roomData: RoomData) => (
  fetch("/api/create-room", {
    method: "POST",
    body: JSON.stringify(roomData)
  }).then<CreateRoomResponse>(res => res.json())
);

export const checkWord = (word: string) => (
  fetch(`/api/check-word/${word}`, { method: "GET" })
    .then(res => res.json())
);
