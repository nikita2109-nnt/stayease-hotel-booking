
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/adminService";
import { LockKeyhole, User, Hotel } from "lucide-react";
import "./AdminLoginPage.css";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await adminLogin(formData);

      const token = response.token || response.data?.token;

      if (!token) {
        throw new Error("Authentication token was not received.");
      }

      localStorage.setItem("adminToken", token);

      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-icon">
          <Hotel size={30} />
        </div>

        <h1>StayEase Admin</h1>
        <p className="admin-login-subtitle">
          Sign in to manage your hotel booking portal
        </p>

        <form onSubmit={handleSubmit}>
          <div className="admin-input-group">
            <label>Username</label>
            <div className="admin-input-wrapper">
              <User size={18} />
              <input
                type="text"
                name="username"
                placeholder="Enter admin username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label>Password</label>
            <div className="admin-input-wrapper">
              <LockKeyhole size={18} />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && <p className="admin-login-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="admin-login-footer">
          Secure administrator access
        </p>
      </div>
    </div>
  );
}

export default AdminLoginPage;
