import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, ArrowRight, AlertCircle } from 'lucide-react';
// Agar path error aaye to '../firebase' ya '/src/firebase' use karein
import { db } from '../../firebase'; 
import { doc, getDoc } from 'firebase/firestore';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Direct Firestore Whitelist Check (Without Password)
      const adminDocRef = doc(db, 'allowed_admins', cleanEmail);
      const adminDoc = await getDoc(adminDocRef);

      if (adminDoc.exists()) {
        // Email found in allowed_admins -> Set LocalStorage session & Redirect
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('adminEmail', cleanEmail);
        
        navigate('/admin/dashboard');
      } else {
        // Email not found in allowed_admins
        setError('Access Denied: This email is not whitelisted in Firestore.');
      }
    } catch (err) {
      console.error("Firestore Access Error:", err);
      setError('Verification failed. Please check network or Firestore security rules.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-[#0B2F6B] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 text-blue-600 p-4 rounded-full shadow-inner">
            <Shield size={36} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Admin Portal Access
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your whitelisted email to manage Bhasa Pro
          </p>
        </div>

        {/* Error Alert Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
              Registered Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="email" 
                required 
                placeholder="e.g. admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-blue-600 text-gray-900"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {loading ? 'Checking Whitelist...' : <>Continue <ArrowRight size={18} /></>}
          </button>
        </form>

        {/* Security Info Box */}
        <div className="mt-6 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-center">
         <p className="text-xs text-blue-800 font-medium text-center">
  Restricted access for authorized administrators only.
</p>
        </div>

        <div className="mt-8 pt-4 border-t text-center">
          <a href="/contribute" className="text-xs text-gray-500 hover:text-gray-800">
            &larr; Back to Public Community Website
          </a>
        </div>

      </div>
    </div>
  );
}