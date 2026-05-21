import { createContext, useContext, useEffect, useState } from "react";
import { getProfile, loginUser, registerUser } from "./api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("dsa_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("dsa_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token && !user) {
      getProfile()
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem("dsa_user", JSON.stringify(data.user));
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, [token, user]);

  const setSession = (data) => {
    const authToken = data.token;
    setToken(authToken);
    setUser(data.user);
    localStorage.setItem("dsa_token", authToken);
    localStorage.setItem("dsa_user", JSON.stringify(data.user));
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(credentials);
      setSession(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerUser(userData);
      setSession(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("dsa_token");
    localStorage.removeItem("dsa_user");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
