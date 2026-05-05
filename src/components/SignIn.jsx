import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || "/home";

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-box">
          <h1>Sign in to <br /> GallCare</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="email" name="email" placeholder="Email address"
              value={form.email} onChange={handleChange} required
            />
            <input
              type="password" name="password" placeholder="Password"
              value={form.password} onChange={handleChange} required
            />

            <div className="checkbox-wrapper">
              <input
                type="checkbox" id="remember" name="remember"
                checked={form.remember} onChange={handleChange}
              />
              <label htmlFor="remember">Remember me</label>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p style={{ marginTop: 20, fontSize: "0.9rem", color: "var(--muted)", textAlign: "center" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--teal)", fontWeight: 600, textDecoration: "none" }}>
              Create one
            </Link>
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-panel">
          <h2>Welcome back</h2>
          <p>Sign in to continue your gallbladder care journey with GallCare.</p>
        </div>
      </div>
    </div>
  );
}
