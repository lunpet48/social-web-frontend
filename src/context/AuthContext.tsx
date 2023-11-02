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
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentUser(user);
  }

  function signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
