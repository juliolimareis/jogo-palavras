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

export const checkWord = (word: string, lang?: Room["type"]) => (
  fetch(`/api/check-word/${word}?${new URLSearchParams({ lang: lang ?? "pt" })}`, { method: "GET" })
    .then(res => res.json())
);