import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api/authService";
import { axiosInstance } from "../services/config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      authService
        .getProfile()
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          delete axiosInstance.defaults.headers.common["Authorization"];
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);

      if (response.access) {
        localStorage.setItem("token", response.access);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.access}`;

        try {
          const userProfile = await authService.getProfile();
          setUser(userProfile);
        } catch (profileError) {
          throw profileError;
        }
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
