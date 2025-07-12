//not using the conext directly create function into the page comoponents.

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth, SignedOut } from '@clerk/nextjs'; // if using Clerk
import { toast } from 'react-toastify';

const AppContext = createContext(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used inside AppContextProvider');
  return context;
};

export const AppContextProvider = ({ children }) => {
  const { user, isSignedIn } = useUser();
  const { getToken, signOut } = useAuth();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null); // custom user data from backend
  const [isSeller, setIsSeller] = useState(false);

  const fetchUserData = async () => {
    try {
      if (!isSignedIn) return;

      const token = await getToken();
      const res = await fetch('/api/user/data', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setUserData(data.user);
        if (data.user.role === 'seller') setIsSeller(true);
      } else {
        toast.error(data.message || 'Failed to load user data');
      }
    } catch (err) {
      toast.error(err.message || 'Fetch error');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      toast.success('Logged out');
      setUserData(null);
    } catch (err) {
      toast.error(err.message || 'Logout failed');
    }
  };

  useEffect(() => {
    if (isSignedIn) fetchUserData();
    else setLoading(false);
  }, [isSignedIn]);

  return (
    <AppContext.Provider
      value={{
        user,          
        userData,       
        isSeller,
        setIsSeller,
        loading,
        fetchUserData,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
