import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { useLoginMutation } from "@/generated/graphql";
import type { Role } from "@/types";

interface LoginProps {
  children: (props: {
    email: string;
    password: string;
    error: string;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  }) => React.ReactNode;
}

export default function Login({ children }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setUser = useUserStore((state) => state.setUser);

  const navigate = useNavigate();
  const [loginMutation] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await loginMutation({
        variables: { loginInput: { email, password } }
      });

      if (data?.login.accessToken && data.login.user) {
        console.log("Login ok, token stocké :", data.login.accessToken);
        localStorage.setItem("token", data.login.accessToken);
        setUser({
  ...data.login.user,
  roles: data.login.user.roles as Role[],
  password: "",
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
        navigate("/chat");
      } else {
        setError("Identifiants incorrects");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la connexion");
    }
  };

  return children({
    email,
    password,
    error,
    onEmailChange: (e) => setEmail(e.target.value),
    onPasswordChange: (e) => setPassword(e.target.value),
    onSubmit: handleSubmit,
  });
}
