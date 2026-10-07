import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('jc_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jc_token');
    if (!token) { setLoading(false); return; }
    authApi.me()
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem('jc_user', JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem('jc_token');
        localStorage.removeItem('jc_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (user, token) => {
    localStorage.setItem('jc_token', token);
    localStorage.setItem('jc_user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('jc_token');
    localStorage.removeItem('jc_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};