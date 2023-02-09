//room-test = b675b85c-407e-493f-a8da-9c9c222164d8
export async function checkRoom(idRoom: string) { 
  return await fetch(`/api/check-room/${idRoom}`, { method: "GET" })
    .then<CheckRoomResponse>(res => res.json())
}