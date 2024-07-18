import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { firestore } from "../config/firebase/init";
import { loadingState } from "../stores/app-state";
import { authState, userState } from "../stores/auth-state";

export default function useUserDocumentListener() {
  const [user, setUser] = useRecoilState(userState);
  const uid = useRecoilValue(authState);
  const setLoading = useSetRecoilState(loadingState);

  useEffect(() => {
    if (!uid) return;

    const userDocRef = doc(firestore, "users", uid);
    const monthlyCollectionRef = collection(userDocRef, "monthly");

    const firestoreUnsubscribe = onSnapshot(
      userDocRef,
      async (docSnapshot) => {
        setLoading(true);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const monthlySnap = await getDocs(monthlyCollectionRef);
          const monthlyData = {};
          monthlySnap.forEach((doc) => {
            monthlyData[doc.id] = doc.data();
          });

          setUser({ ...userData, monthly: monthlyData });
          setLoading(false);
        } else {
          setUser(null);
        }
      },
      (error) => {
        console.error("Error listening to user document:", error);
      },
    );

    return firestoreUnsubscribe;
  }, [uid, setUser]);

  return user;
}
