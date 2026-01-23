import React from 'react';
import { Navigate } from 'react-router-dom';

// This component replaces the deleted Login page to avoid breaking imports.
export default function LoginRemoved() {
  return <Navigate to="/" replace />;
}
