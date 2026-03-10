import React from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from '../utils/auth';

const ProtectedRoute = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: Array<'farmer' | 'worker' | 'buyer' | 'renter' | 'admin'>;
}) => {
  const session = getSession();

  if (!session) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(session.role)) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
