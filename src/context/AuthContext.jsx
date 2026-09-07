import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '/src/firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Security Check: Verify if email is in allowed_admins
          const adminDocRef = doc(db, 'allowed_admins', user.email);
          const adminDoc = await getDoc(adminDocRef);

          if (adminDoc.exists()) {
            setCurrentUser(user); // Whitelisted Admin
          } else {
            console.error("Unauthorized access attempt by:", user.email);
            await signOut(auth); // Block and kick out immediately
            setCurrentUser(null);
            alert("Unauthorized Account. You are not a verified Admin.");
          }
        } catch (error) {
          console.error("Security Check Failed:", error);
          await signOut(auth);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, logout: () => signOut(auth) }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};