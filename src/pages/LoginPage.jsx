import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/LoginPage.css";
import { useAuth } from "../contexts/useAuth";

function LoginPage() {
  const [UserName, SetUserName] = useState("");
  const [Password, SetPassword] = useState("");
  const [RegisterOrLogin, SetRegisterOrLogin] = useState(false);
  const [Registered, SetRegistered] = useState(false);
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useAuth();
  const [error, setError] = useState(false);

  const endpointquery = RegisterOrLogin
    ? "https://localhost:7176/api/User/register"
    : "https://localhost:7176/api/User/login";

  if (Registered) {
    return (
      <div className="Register-Container">
        <div className="Register-note">
          <p>
            User registration successful ..! Return to{" "}
            <div
              style={{ display: "inline-block" }}
              onClick={() => {
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

  const setAccessToken = async (data) => {
    console.log("Setting access token with data:", data);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
    console.log("Access Token set:", data.accessToken);
    console.log("refresh token:", data.refreshToken);
    await setUserData(data.refreshToken);
    navigate("/");
  };

  const setUserData = async (token) => {
    console.log("Fetching user data with token:", token);
    await fetch(`https://localhost:7176/api/User/get-user/${token}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then(async (response) => {
        const responseData = await response.text();
        if (!response.ok) {
          throw new Error(responseData || "Network response was not ok");
        }
        return JSON.parse(responseData);
      })
      .then((data) => {
        console.log("User Data:", data);
        localStorage.setItem("userData", JSON.stringify(data));
        setUser(data);
      })
      .catch((error) => {
        console.log(typeof token);
        console.error("Error:", error);
      });
  };

  const LoginUser = () => {
    const endpoint = endpointquery;
    const payload = {
      username: UserName,
      password: Password,
    };

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const responseData = await response.text();
        if (!response.ok) {
          setError(true);
          throw new Error(responseData || "Network response was not ok");
        }
        return JSON.parse(responseData);
      })
      .then((data) => {
        console.log("Success:", data);
        setError(false);
        if (RegisterOrLogin) {
          return SetRegistered(true);
        }
        setAccessToken(data);
      })
      .catch((error) => {
        setError(true);
        console.error("Error:", error);
      });
  };

  return (
    <div className="LoginPage-Container">
      {error && (
        <div className="error-login">
          <p>Error login : server down to login, please try again later ..!</p>
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
          />
        </div>
        <div className="submit-container">
          <button className="SubmitBtn" onClick={LoginUser}>
            {RegisterOrLogin ? "Register" : "Login"}
          </button>
          <div className="register-login">
            <div
              className="RegisterOrLogin"
              onClick={() => {
                SetRegisterOrLogin(!RegisterOrLogin);
              }}
            >
              {RegisterOrLogin ? "Login" : "Register"}
            </div>
            <a className="ForgotPassword">Forgot Password ?</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
