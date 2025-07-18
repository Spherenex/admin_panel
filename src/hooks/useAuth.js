import { getDatabase, ref, get, child } from "firebase/database";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Your initialized Firebase auth

const login = async ({ email, password }) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  const db = getDatabase();
  const snapshot = await get(child(ref(db), `users/${uid}`));
  if (!snapshot.exists()) {
    throw new Error("User role not found");
  }

  const userData = snapshot.val();
  return { ...userData, uid };
};


