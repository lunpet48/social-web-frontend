"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type user = {
  id: string;
  username: string;
  email: string;
  role: string;
  isLocked: false;
  profile: {
    userId: string;
    bio: string;
    avatar: string;
    fullName: string;
  };
};

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
    profile: {
      userId: "",
      bio: "",
      avatar: "",
      fullName: "",
    },
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
    profile: {
      userId: "",
      bio: "",
      avatar: "",
      fullName: "",
    },
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
      profile: {
        userId: "",
        bio: "",
        avatar: "",
        fullName: "",
      },
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
