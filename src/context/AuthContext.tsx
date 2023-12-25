"use client";
import { Gender } from "@/type/enum";
import { user } from "@/type/type";
import { createContext, useContext, useState, ReactNode } from "react";

type GlobalContent = {
  currentUser: user;
  loginContext: (user: user, token: string) => void;
  signOut: () => void;
  setCurrentUser: (user: user) => void;
};

export const AuthContext = createContext<GlobalContent>({
  currentUser: {
    id: "",
    username: "",
    email: "",
    role: "",
    isLocked: false,
    bio: "",
    avatar: "",
    fullName: "",
    gender: Gender.EMPTY,
    address: "",
    dateOfBirth: "",
  },
  loginContext: () => {},
  signOut: () => {},
  setCurrentUser: () => {},
});

interface Props {
  children?: ReactNode;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<user>({
    id: "",
    username: "",
    email: "",
    role: "",
    isLocked: false,
    bio: "",
    avatar: "",
    fullName: "",
    gender: Gender.EMPTY,
    address: "",
    dateOfBirth: "",
  });

  function loginContext(user: user, token: string) {
    localStorage.setItem("token", token);
    setCurrentUser(user);
  }

  function signOut() {
    localStorage.removeItem("token");
    setCurrentUser({
      id: "",
      username: "",
      email: "",
      role: "",
      isLocked: false,
      bio: "",
      avatar: "",
      fullName: "",
      gender: Gender.EMPTY,
      address: "",
      dateOfBirth: "",
    });
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginContext,
        signOut,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
