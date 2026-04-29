import { useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { setTokens, clearTokens, hasRefreshToken, setUserData, getUserData, clearUserData } from "../services/authStore";

export function AuthProvider({ children }) {
  // Restore session synchronously from localStorage on first render
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!hasRefreshToken());
  const [user, setUser] = useState(() => getUserData());

  const login = useCallback((accessToken, refreshToken, userData) => {
    setTokens(accessToken, refreshToken);
    setUserData(userData);
    setUser(userData);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    clearUserData();
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  // Always render the Provider so children can access context
  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, setUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
