import { Navigate } from 'react-router-dom';
import { storage } from '../utils/storage';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const user = storage.get('currentUser');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/helper'} replace />;
  }

  return children;
};

export default ProtectedRoute;

