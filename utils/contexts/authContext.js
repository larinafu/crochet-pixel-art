"use client"

import { createContext, useState, useEffect } from "react";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [curUser, setCurUser] = useState(null);
  console.log(curUser)
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        user.displayName = user.email.split("@")[0];
        setCurUser(user);
        // ...
      } else {
        // User is signed out
        // ...
        setCurUser(null)
      }
    });
  }, []);
  return <AuthContext.Provider value={curUser}>{children}</AuthContext.Provider>;
};
