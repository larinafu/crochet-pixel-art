"use client";

import { useEffect, useState } from "react";
import { signup } from "@/firebase/auth";

import TextButton from "../../../components/general/buttons/textButton/textButton";

export default function Signup() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        signup(userName, password);
      }}
    >
      <header>
        <h1>Sign Up</h1>
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

      <label>
        <p>Re-Type Password</p>
        <input
          type="text"
          name="passwordConfirm"
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
      </label>
      <TextButton>Register!</TextButton>
    </form>
  );
}
