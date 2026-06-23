import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Leaf } from "lucide-react";
import { API_BASE, saveAuth } from "../utils/adminApi";
import "../css/admin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.user?.role !== "ceo") {
        throw new Error("Only administrators can access this dashboard");
      }

      saveAuth(data.token, data.user);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <Leaf size={36} />
          <h1>Bigogwe Admin</h1>
          <p>Developer administration dashboard</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          {error && <div className="admin-alert admin-alert-error">{error}</div>}

          <label>
            Email
            <div className="admin-input-wrap">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bigogwe.com"
                required
              />
            </div>
          </label>

          <label>
            Password
            <div className="admin-input-wrap">
              <Lock size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </label>

          <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="admin-login-footer">  
          <p>Don't have an account? <a href="/admin/register">Register here</a></p>
        </div>
      </div>
    </div>
  );
}
