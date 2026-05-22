import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="brand">
        <Link to="/">DSA Sheet</Link>
      </div>
      <nav>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/progress">Progress</Link>
            <Link to="/profile">Profile</Link>
            {user?.role === "admin" && <Link to="/admin">Admin</Link>}
            <button className="ghost-button" onClick={logout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      {isAuthenticated && <div className="user-badge">{user?.name}</div>}
    </header>
  );
};

export default NavBar;
