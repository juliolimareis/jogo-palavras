
export default defineNuxtPlugin(() => {
  if (import.meta.server) return;

  // const config = useRuntimeConfig();

  const route = useRoute();

  const idRoom = route.params.id as string;

  const getIdUser = () => {
    const idUser = localStorage?.idUser;

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