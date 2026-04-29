// Token store with localStorage persistence for refresh survival
let accessToken = localStorage.getItem("accessToken") || null;
let refreshToken = localStorage.getItem("refreshToken") || null;

export const setTokens = (access, refresh) => {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
};

export const getAccessToken = () => accessToken;
export const getRefreshToken = () => refreshToken;

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const hasRefreshToken = () => !!refreshToken;

// User data persistence
export const setUserData = (userData) => {
  localStorage.setItem("userData", JSON.stringify(userData));
};

export const getUserData = () => {
  try {
    const data = localStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const clearUserData = () => {
  localStorage.removeItem("userData");
};
