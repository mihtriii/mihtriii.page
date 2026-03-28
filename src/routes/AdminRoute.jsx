import React from 'react';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import Admin from '../pages/Admin.jsx';

export default function AdminRoute() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    </AuthProvider>
  );
}
