"use client";
import Link from "next/link";
import Image from "next/image";
import { AuthContext } from "@/utils/contexts/authContext";
import { useContext, useState } from "react";
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import logo from "@/public/icons/logo.jpg";

import styles from "./navbar.module.css";

export default function Navbar() {
  const user = useContext(AuthContext);
  const [openUserOptions, setOpenUserOptions] = useState(false);
  return (
    <nav className={styles.container}>
      <div className={styles.left}>
        <Link href="/">
          <p>yarn</p>
          <Image src={logo} width={40} /> <p>toolkit</p>
        </Link>
      </div>
      <div className={styles.center}>
        <Link href="/">
          <p>home</p>
        </Link>
        <Link href="/projects">
          <p>my projects</p>
        </Link>
      </div>

      <div className={styles.right}>
        {user ? (
          <div
            onPointerEnter={() => {
              setOpenUserOptions(true);
            }}
            onPointerLeave={() => {
              setOpenUserOptions(false);
            }}
          >
            <Link href="/profile">
              <p>hello, {user.displayName}</p>
            </Link>
            {openUserOptions && (
              <button
                onClick={() => {
                  signOut(auth)
                    .then(() => {
                      // Sign-out successful.
                    })
                    .catch((error) => {
                      // An error happened.
                    });
                }}
              >
                logout
              </button>
            )}
          </div>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
