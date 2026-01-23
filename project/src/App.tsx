import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DevErrorBoundary from './components/DevErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import ToastProvider from './components/ToastProvider';

const LazyLogin = React.lazy(() => import('./components/LoginModern'));
const LazyFarmerProfileSetup = React.lazy(() => import('./components/FarmerProfileSetup'));
const LazyProfileCompletion = React.lazy(() => import('./components/ProfileCompletion'));
const LazyFarmOwner = React.lazy(() => import('./components/FarmOwnerDashboard'));
const LazyAICropAdvisor = React.lazy(() => import('./components/AICropAdvisor'));
const LazyFarmWorker = React.lazy(() => import('./components/FarmWorkerDashboard'));
const LazyBuyer = React.lazy(() => import('./components/BuyerDashboard'));
const LazyRenter = React.lazy(() => import('./components/RenterDashboard'));
const LazyAnalytics = React.lazy(() => import('./components/AnalyticsDashboard'));
const LazyDataManagement = React.lazy(() => import('./components/DataManagement'));
const LazySupportPage = React.lazy(() => import('./components/SupportPage'));
const LazyCropsPage = React.lazy(() => import('./components/CropsPage'));
const LazyFarmDocsPage = React.lazy(() => import('./components/FarmDocsPage'));
const LazyFeaturesDashboard = React.lazy(() => import('./components/FeaturesDashboard'));

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
      <ToastProvider />
      <Suspense fallback={<div className="text-center text-gray-600 p-8">Loading…</div>}>
        <DevErrorBoundary>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LazyLogin />} />
            <Route path="/support" element={<LazySupportPage />} />
            <Route path="/crops" element={<LazyCropsPage />} />
            <Route path="/farm-docs" element={<LazyFarmDocsPage />} />
            <Route
              path="/farmer-profile-setup"
              element={
                <ProtectedRoute roles={['farmer']}>
                  <LazyFarmerProfileSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile-completion"
              element={
                <ProtectedRoute roles={['worker', 'buyer', 'renter']}>
                  <LazyProfileCompletion />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farm-owner"
              element={
                <ProtectedRoute>
                  <LazyFarmOwner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crop-advisor"
              element={
                <ProtectedRoute>
                  <LazyAICropAdvisor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <LazyAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/data-management"
              element={
                <ProtectedRoute>
                  <LazyDataManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farm-worker"
              element={
                <ProtectedRoute roles={['worker']}>
                  <LazyFarmWorker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer"
              element={
                <ProtectedRoute roles={['buyer']}>
                  <LazyBuyer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/renter"
              element={
                <ProtectedRoute roles={['renter']}>
                  <LazyRenter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/features"
              element={
                <ProtectedRoute>
                  <LazyFeaturesDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </DevErrorBoundary>
      </Suspense>
    </div>
  );
}

export default App;
