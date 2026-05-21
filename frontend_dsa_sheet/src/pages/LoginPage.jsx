import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const { login, error, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Please enter both email and password.");
      return;
    }

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setFormError(err.response?.data?.message || "Unable to sign in.");
    }
  };

  return (
    <main className="page-shell">
      <section className="auth-panel">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in to your account</h1>
          <p className="subtext">
            Access your topics, track solved problems, and pick up where you left off.
          </p>
        </div>

        <form onSubmit={submitHandler} className="form-card">
          {(formError || error) && <div className="form-error">{formError || error}</div>}

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="form-note">
            Don’t have an account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
