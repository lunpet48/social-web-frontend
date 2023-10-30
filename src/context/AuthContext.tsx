"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type GlobalContent = {
  currentUser: object;
  loginContext: (user: object, token: string) => void;
  signOut: () => void;
};

export const AuthContext = createContext<GlobalContent>({
  currentUser: {},
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
  const [currentUser, setCurrentUser] = useState<object>({});

  function loginContext(user: object, token: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentUser(user);
  }

  function signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser({});
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
