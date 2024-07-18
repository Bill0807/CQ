import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

import { firebaseAuth } from "../config/firebase/init";
import { authState } from "../stores/auth-state";

export default function useAuthStateListener() {
  const [uid, setAuthState] = useRecoilState(authState);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      console.log("user @ useAuthStateListener >> ", user);
      if (user) {
        setAuthState(user.uid);
      } else {
        setAuthState(null);
      }
    });
  }, []);

  return uid;
}
