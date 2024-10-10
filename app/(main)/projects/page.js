"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/utils/contexts/authContext";
import { db, auth } from "@/firebase/firebase";
import { getDocs, collection } from "firebase/firestore";
export default function Page() {
  const authContext = useContext(AuthContext);
  const [docs, setDocs] = useState([]);
  console.log(authContext);
  useEffect(() => {
    const getDocuments = async () => {
      const querySnapshot = await getDocs(
        collection(db, "users", authContext.uid, "projects")
      );
      console.log(querySnapshot);
      querySnapshot.forEach((doc) => {
        setDocs((docs) => [...docs, doc.id]);
      });
    };
    if (authContext) {
      getDocuments();
    }
  }, [authContext]);

  return <h1>{docs}</h1>;
}
