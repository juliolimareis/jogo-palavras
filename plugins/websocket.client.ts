import { v4 as uuid, } from "uuid";

export default defineNuxtPlugin(() => {
  if (process.server) return;

  const route = useRoute();

  const idRoom = route.params.id as string;

  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  // const socket = new WebSocket(`${wsProtocol}//${window.location.host}`);
  const socket = new WebSocket(`${wsProtocol}//localhost:3007`);
  // const socket = new WebSocket(`${wsProtocol}//192.168.70.230:1547`);
  // const socket = new WebSocket(`${wsProtocol}//${window.location.host}:3007`);

  // alert(window.location.host);

  const getIdUser = () => {
    const idUser = localStorage?.idUser ?? uuid();
    
    localStorage.setItem("idUser", idUser)
  
    return idUser;
  };
  
  const getName = () => {
    let userName = localStorage?.userName;

    if(!userName){
      localStorage.setItem("userName", "sem nome");
      userName = "sem nome";
    }
  
    return userName;
  };

  return { 
    provide: {
      socket,
      idRoom,
      idUser: getIdUser(),
      userName: getName()
    }
  };
});