import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, orgAdminOnly = false, learnerOnly = false }) {
  const { token, user, fetchMe, isOrgAdmin, isLearner } = useAuthStore();
  const authed = token || localStorage.getItem('skillforge_token');

  useEffect(() => {
    if (authed && !user) fetchMe();
  }, [authed, user, fetchMe]);

  if (!authed) return <Navigate to="/login" replace />;
  if (orgAdminOnly && !isOrgAdmin()) return <Navigate to="/dashboard" replace />;
  if (learnerOnly && !isLearner()) return <Navigate to="/dashboard" replace />;

  return children;
}
