import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  setTokens,
  clearTokens,
  setUserData,
  getUserData,
  clearUserData,
} from "../services/authStore";

export function AuthProvider({ children }) {
  // Restore session synchronously from localStorage on first render
  const [user, setUser] = useState(() => getUserData());
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getUserData());
  const [isLoading, setIsLoading] = useState(false); /* 👈 Start as false since storage check is synchronous */

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

  // On mount, we already initialized state from localStorage.
  // We don't need to manually refresh here because the api.js interceptor 
  // will handle it automatically on the first API call that returns a 401.
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = getUserData();
      if (!userData) {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Always render the Provider so children can access context
  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, setUser, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
