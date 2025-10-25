"use client";

import { login, logout, register } from "@/services/AuthService";
import { clearTokenCookie, setTokenCookie } from "@/services/CookieService";
import { getUserDetails } from "@/services/UserService";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loginUser: (loginRequest: LoginRequest) => Promise<void>;
  registerUser: (registerRequest: RegisterRequest) => Promise<void>;
  logoutUser: () => Promise<void>;
  getUser: (userId?: string) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: function (user: User | null): void {},
  loginUser: async function (loginRequest: LoginRequest): Promise<void> {},
  registerUser: async function (
    registerRequest: RegisterRequest
  ): Promise<void> {},
  logoutUser: async function (): Promise<void> {},
  getUser: async function (userId?: string): Promise<void> {},
  isLoading: false,
});

export const AuthProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    return getUserDetails().then((response) => response && setUser(response));
  }

  async function handlePostLogin(authToken?: AuthToken) {
    if (!authToken) return;
    await setTokenCookie(authToken);
    await getUser();
    setIsLoading(false);
  }

  async function loginUser(loginRequest: LoginRequest) {
    setIsLoading(true);
    return login(loginRequest).then(handlePostLogin);
  }

  async function registerUser(registerRequest: RegisterRequest) {
    setIsLoading(true);
    return register(registerRequest).then(handlePostLogin);
  }

  async function logoutUser() {
    setIsLoading(true);
    logout().then((response) => {
      if (response.status === 200) {
        clearTokenCookie();
        setUser(null);
      }
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loginUser,
        registerUser,
        getUser,
        logoutUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
