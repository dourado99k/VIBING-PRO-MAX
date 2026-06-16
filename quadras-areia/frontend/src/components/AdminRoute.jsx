import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import Loading from './Loading';

export default function AdminRoute({ children }) {
  const { token, user, checkAuth, isAuthenticated, isAdmin } = useAuthStore();
  const authed = isAuthenticated();

  useEffect(() => {
    if (authed && !user) checkAuth();
  }, [authed, user, checkAuth]);

  if (!authed) return <Navigate to="/login" replace />;
  if (authed && !user) return <Loading />;
  if (!isAdmin()) return <Navigate to="/cliente" replace />;

  return children;
}
