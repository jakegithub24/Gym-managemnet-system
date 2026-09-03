import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser, canAccess } = useAuth();
  const location = useLocation();

  // Not logged in → send to login, remember where they wanted to go
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but no permission for this route
  if (!canAccess(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
