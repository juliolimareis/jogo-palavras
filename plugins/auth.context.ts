import { type UserCredential, browserLocalPersistence, signInWithEmailAndPassword, } from "firebase/auth";
import { useFirebase } from "~/composables/useFirebase";

export default defineNuxtPlugin(() => {
  const { auth } = useFirebase();
  const errorCode = useState(() => "");
  const user = useState<UserCredential["user"] | undefined>(() => undefined);

  async function fetchLogin() {
    await auth.setPersistence(browserLocalPersistence);

    if (auth.currentUser) {
      user.value = auth.currentUser;
    }
  };

  async function onLogin (email: string, password: string) {
    await auth.setPersistence(browserLocalPersistence);

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        user.value = userCredential.user;
      });
  };

  function onLogout () {
    user.value = undefined;

    return auth.signOut();
  }

  return { provide: { fetchLogin, onLogin, onLogout, user, errorCode } };
});