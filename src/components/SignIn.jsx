import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!form.email.trim() || !form.password) {
      return "Email and password are required.";
    }

    if (!form.email.includes("@")) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    navigate("/home");
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-box">
          <h1>
            Sign in to <br /> GallCare
          </h1>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              <label htmlFor="remember">Remember me</label>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button className="submit-btn" type="submit">
              Sign In
            </button>
          </form>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-panel">
          <h2>Welcome back</h2>
          <p>
            Sign in to continue your gallbladder care journey with GallCare.
          </p>
        </div>
      </div>
    </div>
  );
}
