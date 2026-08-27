import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, canAccess } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-specific redirect — gym members go to /member portal
  if (currentUser.role === 'gym_member' && !location.pathname.startsWith('/member')) {
    return <Navigate to="/member" replace />;
  }

  // Staff/admin trying to access /member — redirect to dashboard
  if (currentUser.role !== 'gym_member' && location.pathname.startsWith('/member')) {
    return <Navigate to="/dashboard" replace />;
  }

  // allowedRoles whitelist (optional — used on specific route configs)
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Path-level permission check
  if (!canAccess(location.pathname)) {
    const fallback = currentUser.role === 'gym_member' ? '/member' : '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return children;
}
