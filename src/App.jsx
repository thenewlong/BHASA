import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { WordProvider } from './context/WordContext';

// Layout Import
import AdminLayout from './layouts/AdminLayout';

// Admin Pages Imports
import Dashboard from './pages/admin/Dashboard';
import Moderation from './pages/admin/Moderation';
import Lexicon from './pages/admin/Lexicon';
import DatasetUpload from './pages/admin/DatasetUpload';
import CorpusAnalysis from './pages/admin/CorpusAnalysis';
import AdminLogin from './pages/admin/AdminLogin';

// Community Page Import
import SubmitWord from './pages/community/SubmitWord';

// 🔒 HIGH SECURITY PROTECTED ROUTE (Connected to LocalStorage Whitelist Session)
const ProtectedRoute = ({ children }) => {
  // Check if admin is logged in (session saved by AdminLogin.jsx)
  const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    // Agar login nahi hai, toh wapas login page pe bhej do
    return <Navigate to="/admin/login" replace />;
  }
  
  // Agar whitelisted email se verified hai, toh page access do
  return children;
};

function App() {
  return (
    <WordProvider>
      <Router>
        <Routes>
          {/* 1. PUBLIC WEBSITE: Default route is Word Contribution page */}
          <Route path="/" element={<SubmitWord />} />
          <Route path="/contribute" element={<SubmitWord />} />

          {/* 2. ADMIN AUTH: Passwordless Firestore Login Page */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 3. PROTECTED ADMIN PORTAL: Only accessible to Whitelisted Admins */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            {/* Default redirect to dashboard if just /admin is accessed */}
            <Route index element={<Navigate to="dashboard" replace />} />
            
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="upload" element={<DatasetUpload />} />
            <Route path="moderation" element={<Moderation />} />
            <Route path="analysis" element={<CorpusAnalysis />} />
            <Route path="lexicon" element={<Lexicon />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </WordProvider>
  );
}

export default App;