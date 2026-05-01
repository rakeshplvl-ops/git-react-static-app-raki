import { useState } from "react";
import "../css/task-form.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import api from "../services/api";
import { setUserData } from "../services/authStore";

function EditProfilePage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    contact: user?.contact || "",
    username: user?.username || "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const updatePayload = {
        id: user.id,
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        username: formData.username,
      };

      if (formData.password) {
        updatePayload.password = formData.password;
      }

      const res = await api.put('/User/update', updatePayload);
      console.log("Profile updated successfully:", res.data);

      // Update auth context and localStorage with new user data
      setUserData(res.data);
      login(localStorage.getItem("accessToken"), localStorage.getItem("refreshToken"), res.data);

      setSuccess(true);
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    }
  };

  if (!user) {
    return (
      <div className="task-form-container">
        <div className="task-form-card">
          <p style={{ color: "#94a3b8" }}>Please log in to edit your profile.</p>
          <button
            className="task-form-btn task-form-btn-primary"
            onClick={() => navigate("/login")}
            style={{ marginTop: "16px" }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-form-container">
      <div className="task-form-card">
        <h2>Edit Profile</h2>

        <form onSubmit={handleSubmit}>
          <div className="task-form-group" style={{ marginBottom: "16px" }}>
            <label className="task-form-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="task-form-input"
            />
          </div>

          <div className="task-form-group" style={{ marginBottom: "16px" }}>
            <label className="task-form-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your username"
              className="task-form-input"
            />
          </div>

          <div className="task-form-group" style={{ marginBottom: "16px" }}>
            <label className="task-form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
              className="task-form-input"
            />
          </div>

          <div className="task-form-group" style={{ marginBottom: "16px" }}>
            <label className="task-form-label">Contact</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Your contact number"
              className="task-form-input"
            />
          </div>

          <div className="task-form-group" style={{ marginBottom: "16px" }}>
            <label className="task-form-label">New Password (leave blank to keep current)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="task-form-input"
            />
          </div>

          {formData.password && (
            <div className="task-form-group" style={{ marginBottom: "16px" }}>
              <label className="task-form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="task-form-input"
              />
            </div>
          )}

          <div className="task-form-actions">
            <button
              type="button"
              className="task-form-btn task-form-btn-secondary"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
            <button type="submit" className="task-form-btn task-form-btn-primary">
              Save Changes
            </button>
          </div>

          {error && <div className="task-form-error">{error}</div>}
          
          {success && (
            <div style={{
              marginTop: "16px",
              padding: "12px 16px",
              background: "rgba(34, 197, 94, 0.1)",
              border: "1px solid #22c55e",
              borderRadius: "10px",
              color: "#86efac",
              fontSize: "14px"
            }}>
              Profile updated successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditProfilePage;
