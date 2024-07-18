import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { firebaseAuth } from "./init";

const signup = async ({ email, password }) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );

    if (user) {
      const token = await user.getIdToken();
      const uid = user.uid;
      return { uid, token };
    }
  } catch (error) {
    console.error("Failed to signup user: ", error);
    throw error;
  }
};

const login = async ({ email, password }) => {
  try {
    const { user } = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );

    if (user) {
      const token = await user.getIdToken();
      const uid = user.uid;
      return { uid, token };
    }
  } catch (error) {
    console.error("Failed to login user: ", error);
    throw error;
  }
};

const logout = async () => {
  try {
    await signOut(firebaseAuth);
  } catch (error) {
    console.error(error);
  }
};

const remove = async () => {
  try {
    const user = firebaseAuth.currentUser;
    await deleteUser(user);
    return true;
  } catch (error) {
    console.error("Error deleting user on firebase/auth: ", error);
    throw error;
  }
};

export default { signup, login, logout, remove };
