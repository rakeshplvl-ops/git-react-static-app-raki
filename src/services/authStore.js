// Token store with localStorage persistence for refresh survival
let accessToken = localStorage.getItem("accessToken") || null;
let refreshToken = localStorage.getItem("refreshToken") || null;

export const getAccessToken = () => accessToken;
export const getRefreshToken = () => refreshToken;

export const setTokens = (access, refresh) => {
  console.log("Setting refresh token:", refresh);
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
  accessToken = access;
  refreshToken = refresh;
  console.log(
    "After set - stored refresh token:",
    localStorage.getItem("refreshToken"),
  );
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  accessToken = null;
  refreshToken = null;
};

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
