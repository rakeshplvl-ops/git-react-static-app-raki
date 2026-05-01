import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/LoginPage.css";
import { useAuth } from "../contexts/useAuth";
import api from "../services/api";

function LoginPage() {
  const [UserName, SetUserName] = useState("");
  const [Password, SetPassword] = useState("");
  const [isRegister, SetIsRegister] = useState(false);
  const [Registered, SetRegistered] = useState(false);
  const { login } = useAuth();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (Registered) {
    return (
      <div className="Register-Container">
        <div className="Register-note">
          <p style={{ color: "white" }}>
            User registration successful ..! Return to{" "}
            <div
              style={{
                display: "inline-block",
                color: "green",
                cursor: "pointer",
              }}
              onClick={() => {
                SetIsRegister(false);
                SetRegistered(false);
              }}
            >
              Login ..!
            </div>
          </p>
        </div>
      </div>
    );
  }

  // gets user data
  const fetchUserData = async (refreshToken) => {
    console.log("Fetching user data with token:", refreshToken);
    try {
      // Backend expects [FromBody]string - needs JSON string format
      const res = await api.post(
        "/User/get-user",
        JSON.stringify(refreshToken),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      console.log("User Data:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  // login with creds
  const LoginUser = async () => {
    const endpoint = isRegister ? "/User/register" : "/User/login";
    const payload = {
      username: UserName,
      password: Password,
    };

    try {
      const res = await api.post(endpoint, payload);
      console.log("Success:", res.data);
      setIsError(false);

      if (isRegister) {
        return SetRegistered(true);
      }

      // Fetch user data
      const userData = await fetchUserData(res.data.refreshToken);

      // Store user data for session persistence

      // Update React state
      login(res.data.accessToken, res.data.refreshToken, userData);
      console.log(
        "check this",
        res.data.accessToken,
        res.data.refreshToken,
        userData,
      );
      // Navigate after login completes
      navigate("/");
    } catch (error) {
      setError(error.response?.data || "Login failed");
      setIsError(true);
      console.error("Error:", error);
    }
  };

  return (
    <div className="LoginPage-Container">
      {isError && (
        <div className="error-login">
          <p>{error}</p>
        </div>
      )}
      <div className="LoginPage-Inner-Container">
        <div className="input-container">
          <label className="inputLabel" htmlFor="UserName">
            Username
          </label>
          <input
            className="inputText"
            type="text"
            name="UserName"
            id="UserName"
            value={UserName}
            onChange={(e) => {
              SetUserName(e.target.value);
            }}
          />
        </div>
        <div className="input-container">
          <label className="inputLabel" htmlFor="password">
            Password
          </label>
          <input
            className="inputText"
            type="password"
            name="password"
            id="password"
            value={Password}
            onChange={(e) => {
              SetPassword(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") LoginUser();
            }}
          />
        </div>
        <div className="submit-container">
          <button className="SubmitBtn" onClick={LoginUser}>
            {isRegister ? "Register" : "Login"}
          </button>
          <div className="register-login">
            <div
              className="RegisterOrLogin"
              onClick={() => {
                SetIsRegister(!isRegister);
              }}
            >
              {isRegister ? "Login" : "Register"}
            </div>
            <a className="ForgotPassword">Forgot Password ?</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
