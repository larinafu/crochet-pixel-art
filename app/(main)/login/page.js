"use client";

import Link from "next/link";
import { useState } from "react";
import { login } from "@/firebase/auth";

import TextButton from "../../../components/general/buttons/textButton/textButton";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login(userName, password);
        }}
      >
        <header>
          <h1>Log In</h1>
        </header>
        <label>
          <p>Username</p>
          <input
            type="text"
            name="username"
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>

        <label>
          <p>Password</p>
          <input
            type="text"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <TextButton>Login!</TextButton>
      </form>
      <p>
        Don't have an account? <Link href="/signup">Sign Up</Link>
      </p>
    </>
  );
}
