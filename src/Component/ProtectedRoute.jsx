// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../App';

const ProtectedRoute = ({ requiredRole }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to='/login' />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to unauthorized page if role doesn't match
    return <Navigate to='/unauthorized' />;
  }

  // Render child routes if user is authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoute;
