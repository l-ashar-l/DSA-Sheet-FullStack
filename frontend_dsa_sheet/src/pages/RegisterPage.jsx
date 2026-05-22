import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const { register, error, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!name || !email || !password) {
      setFormError("Please enter name, email, and password.");
      return;
    }

    try {
      await register({ name, email, password });
      navigate("/dashboard");
    } catch (err) {
      setFormError(err.response?.data?.message || "Unable to register.");
    }
  };

  return (
    <main className="page-shell">
      <section className="auth-panel">
        <div>
          <p className="eyebrow">Create your account</p>
          <h1>Register for DSA Sheet</h1>
          <p className="subtext">
            Get started with a free account and track your algorithm practice.
          </p>
        </div>

        <form onSubmit={submitHandler} className="form-card">
          {(formError || error) && <div className="form-error">{formError || error}</div>}

          <label>
            Full name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

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
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="form-note">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default RegisterPage;
