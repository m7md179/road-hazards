import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, value }) => {
  // If value is provided (from App.js for our mock login), use it
  // otherwise use the normal implementation
  const [user, setUser] = useState(value?.user || null);
  const [loggedIn, setLoggedIn] = useState(value?.loggedIn || false);

  useEffect(() => {
    // If value props change, update our state
    if (value?.user) {
      setUser(value.user);
    }
    if (value?.loggedIn !== undefined) {
      setLoggedIn(value.loggedIn);
    }
  }, [value?.user, value?.loggedIn]);

  const login = (userData) => {
    setUser(userData);
    setLoggedIn(true);
    // In a real app, you'd store the token in localStorage
  };

  const logout = () => {
    setUser(null);
    setLoggedIn(false);
    // In a real app, you'd remove the token from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loggedIn, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);