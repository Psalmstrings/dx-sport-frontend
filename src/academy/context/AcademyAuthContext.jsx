import React, { createContext, useContext, useState, useEffect } from 'react';
import ElearningAPI from '../../services/elearningApi';

const AcademyAuthContext = createContext(null);

export const AcademyAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('dx_academy_token');
    const savedUser = localStorage.getItem('dx_academy_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify with /me
        ElearningAPI.getMe()
          .then(res => {
            if (res.user) {
              setUser(res.user);
              localStorage.setItem('dx_academy_user', JSON.stringify(res.user));
            }
          })
          .catch(() => {
            // Token expired or invalid
            logout();
          })
          .finally(() => setLoading(false));
      } catch (e) {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await ElearningAPI.login({ email, password });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('dx_academy_token', res.token);
      localStorage.setItem('dx_academy_user', JSON.stringify(res.user));
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await ElearningAPI.register(formData);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('dx_academy_token', res.token);
      localStorage.setItem('dx_academy_user', JSON.stringify(res.user));
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dx_academy_token');
    localStorage.removeItem('dx_academy_user');
  };

  const refreshUser = async () => {
    try {
      const res = await ElearningAPI.getMe();
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('dx_academy_user', JSON.stringify(res.user));
      }
    } catch (e) {}
  };

  return (
    <AcademyAuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AcademyAuthContext.Provider>
  );
};

export const useAcademyAuth = () => {
  const context = useContext(AcademyAuthContext);
  if (!context) {
    throw new Error('useAcademyAuth must be used within an AcademyAuthProvider');
  }
  return context;
};

export default AcademyAuthContext;
