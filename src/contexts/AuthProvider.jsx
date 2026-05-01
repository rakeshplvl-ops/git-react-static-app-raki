import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";
import {
  setTokens,
  clearTokens,
  setUserData,
  getUserData,
  clearUserData,
  getRefreshToken,
} from "../services/authStore";

export function AuthProvider({ children }) {
  // Restore session synchronously from localStorage on first render
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(() => getUserData());
  const [isLoading, setIsLoading] = useState(true);

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

  //app start
  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await api.post("User/refresh", {
          refreshToken,
        });

        setTokens(res.data.accessToken, res.data.refreshToken);

        setIsLoggedIn(true);
      } catch (err) {
        console.log(err);
        clearTokens();
        clearUserData();
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false); // 👈 always stop loading
      }
    };

    initAuth();
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
