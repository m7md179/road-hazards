import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const adminCredentials = {
  username: "admin",
  password: "1234",
  userData: {
    id: "admin-1",
    name: "Administrator",
    email: "admin@roadhazard.com",
    is_admin: true,
  },
};

export const AuthProvider = ({ children, value }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  useEffect(() => {
    // If value props change, update our state
    if (value?.user !== undefined) {
      setUser(value.user);
    }
    if (value?.loggedIn !== undefined) {
      setLoggedIn(value.loggedIn);
    }
  }, [value?.user, value?.loggedIn]);

  const login = async (username, password) => {
    // Reset previous state
    setUser(null);
    setLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    // Check admin credentials
    if (!username || !password) {
      return { success: false, error: "Username and password are required" };
    }

    if (
      username.trim() === adminCredentials.username &&
      password === adminCredentials.password
    ) {
      setUser(adminCredentials.userData);
      setLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(adminCredentials.userData));
      localStorage.setItem("isLoggedIn", "true");
      return { success: true };
    }
    return { success: false, error: "Invalid username or password" };
  };

  const logout = () => {
    setUser(null);
    setLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, loggedIn, setLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
