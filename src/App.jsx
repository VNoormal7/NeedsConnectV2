import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { initializeData } from './utils/storage';
import Login from './pages/Login';
import HelperDashboard from './pages/HelperDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NeedsList from './pages/NeedsList';
import ImpactDashboard from './pages/ImpactDashboard';
import VolunteerSystem from './pages/VolunteerSystem';
import Basket from './pages/Basket';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/helper"
          element={
            <ProtectedRoute>
              <HelperDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<NeedsList />} />
          <Route path="impact" element={<ImpactDashboard />} />
          <Route path="basket" element={<Basket />} />
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteers"
          element={
            <ProtectedRoute>
              <VolunteerSystem />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

