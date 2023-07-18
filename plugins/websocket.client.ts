import { v4 as uuid, } from "uuid";

export default defineNuxtPlugin(() => {
  if (process.server) return;

  // const config = useRuntimeConfig();

  const route = useRoute();

  const idRoom = route.params.id as string;

  const getIdUser = () => {
    const idUser = localStorage?.idUser ?? uuid();

    localStorage.setItem("idUser", idUser);

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
      idRoom,
      idUser: getIdUser(),
      userName: getName()
    }
  };
});