import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/LoginPage.css";
import { useAuth } from "../contexts/useAuth";
import api from "../services/api";
import { useToast } from "../contexts/ToastContext";

function LoginPage() {
  const [UserName, SetUserName] = useState("");
  const [Password, SetPassword] = useState("");
  const [isRegister, SetIsRegister] = useState(false);
  const [Registered, SetRegistered] = useState(false);
  const [Email, SetEmail] = useState("");
  const [Contact, SetContact] = useState("");
  const { login } = useAuth();
  const { showToast } = useToast();
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
    try {
      // Backend expects [FromBody]string - needs JSON string format
      const res = await api.post(
        "/User/get-user",
        JSON.stringify(refreshToken),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  // login with creds
  const LoginUser = async () => {
    // 🛡️ CLIENT-SIDE VALIDATION (Only for Registration)
    if (isRegister) {
      if (UserName.trim().length < 8) {
        return showToast("Username must be at least 8 characters long for registration.", "error");
      }
      if (Password.trim().length < 8) {
        return showToast("Password must be at least 8 characters long for registration.", "error");
      }
      if (!Email.includes("@")) {
        return showToast("Please enter a valid email address.", "error");
      }
    }

    const endpoint = isRegister ? "/User/register" : "/User/login";
    const payload = {
      username: UserName,
      password: Password,
      ...(isRegister && { email: Email, contact: Contact })
    };

    try {
      const res = await api.post(endpoint, payload);
      setIsError(false);

      if (isRegister) {
        return SetRegistered(true);
      }

      // Fetch user data (Mandatory for a healthy session)
      const userData = await fetchUserData(res.data.refreshToken);
      
      if (!userData) {
        throw new Error("Login successful, but failed to retrieve profile details. Please try again.");
      }

      // Update React state
      login(res.data.accessToken, res.data.refreshToken, userData);

      // Navigate after login completes
      navigate("/");
    } catch (error) {
      setError(error.response?.data || "Login failed");
      setIsError(true);
      console.error("Error at login:", error);
    }
  };

  return (
    <div className="LoginPage-Container">
      {/* 🔮 Background Decor */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

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

        {isRegister && (
          <>
            <div className="input-container">
              <label className="inputLabel" htmlFor="Email">
                Email
              </label>
              <input
                className="inputText"
                type="email"
                name="Email"
                id="Email"
                value={Email}
                onChange={(e) => {
                  SetEmail(e.target.value);
                }}
              />
            </div>
            <div className="input-container">
              <label className="inputLabel" htmlFor="Contact">
                Contact
              </label>
              <input
                className="inputText"
                type="text"
                name="Contact"
                id="Contact"
                value={Contact}
                onChange={(e) => {
                  SetContact(e.target.value);
                }}
              />
            </div>
          </>
        )}

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
