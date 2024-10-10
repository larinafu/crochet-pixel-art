import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

export const login = (email, pass) => {
  signInWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log(success);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      // ..
    });
};

export const signup = async (email, pass) => {
  console.log(email, pass);
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    console.log("success");
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      email: auth.currentUser.email,
    });
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
  }
};
