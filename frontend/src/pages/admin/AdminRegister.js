import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Leaf, UserPlus } from "lucide-react";
import { apiRequest, clearAuth, getStoredAuth } from "../../utils/adminApi";
import "../../css/admin.css";

export default function AdminRegister() {
  const navigate = useNavigate();
  const auth = getStoredAuth();

  const [name_user, setNameUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [adminExists, setAdminExists] = useState(null);

  useEffect(() => {
    let active = true;
    apiRequest("/auth/admin-status")
      .then((result) => {
        if (!active) return;
        setAdminExists(result.hasAdmin);
        // If admin exists and user is not authenticated/not CEO, redirect to login
        if (result.hasAdmin && (!auth?.token || auth.user?.role !== "ceo")) {
          navigate("/admin/login");
        }
      })
      .catch((err) => {
        if (active) {
          // If error checking admin status, assume no admin exists (first registration)
          console.log("Admin status check failed, allowing registration:", err.message);
          setAdminExists(false);
        }
      });
    return () => {
      active = false;
    };
  }, [auth, navigate]);

  const showMessage = (type, text) => {
    setMessageType(type);
    setMessage(text);
    setTimeout(() => setMessage(""), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = { name_user, email, password };
      const result = await apiRequest("/auth/register-admin", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      showMessage("success", `Developer/admin created: ${result.email}`);

      setNameUser("");
      setEmail("");
      setPassword("");
    } catch (err) {
      if (
        err.message.includes("Authentication") ||
        err.message.includes("token") ||
        err.message.includes("Admin access")
      ) {
        clearAuth();
        navigate("/admin/login");
        return;
      }
      showMessage("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (adminExists === null) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-brand">
            <Leaf size={36} />
            <h1>Checking admin setup...</h1>
            <p>Please wait while we verify whether a CEO admin already exists.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <Leaf size={36} />
          <h1>Register Developer/Admin</h1>
          <p>
            {adminExists
              ? "An existing CEO account was found. Login first to create another admin."
              : "Create the first CEO account for this application."
            }
          </p>
        </div>

        {message && <div className={`admin-alert admin-alert-${messageType}`}>{message}</div>}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label>
            Name
            <div className="admin-input-wrap">
              <UserPlus size={18} />
              <input
                type="text"
                value={name_user}
                onChange={(e) => setNameUser(e.target.value)}
                placeholder="Developer name"
                required
              />
            </div>
          </label>

          <label>
            Email
            <div className="admin-input-wrap">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dev@bigogwe.com"
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
                placeholder="Set password"
                required
              />
            </div>
          </label>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Admin"}
          </button>

          <button
            type="button"
            className="admin-btn admin-btn-ghost"
            onClick={() => navigate("/admin/dashboard")}
            disabled={loading}
          >
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

