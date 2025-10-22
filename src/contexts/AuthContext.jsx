// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase/config';

const AuthContext = createContext();

// Mock user data for development
const MOCK_USERS = [
  {
    uid: 'mock-user-123',
    displayName: 'Demo User',
    email: 'demo@example.com',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    emailVerified: true,
    providerData: [{ providerId: 'google.com' }]
  },
  {
    uid: 'mock-admin-456',
    displayName: 'Admin User',
    email: 'admin@example.com',
    photoURL: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    emailVerified: true,
    isAdmin: true,
    providerData: [{ providerId: 'google.com' }]
  },
  {
    uid: 'mock-admin-789',
    displayName: 'Arun Kumar',
    email: 'arun.kumar@example.com',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    emailVerified: true,
    isAdmin: true,
    providerData: [{ providerId: 'google.com' }]
  }
];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mockUsers] = useState(MOCK_USERS);

  // Check if user is admin based on email
  const checkIsAdmin = (email) => {
    const adminEmails = ['admin@example.com'];
    return adminEmails.includes(email);
  };

useEffect(() => {
  const storedUser = localStorage.getItem('mockAuthUser');
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    // Ensure isAdmin property is set correctly
    const adminEmails = ['admin@example.com', 'arun.kumar@example.com'];
    userData.isAdmin = adminEmails.includes(userData.email);
    setUser(userData);
  }
  setLoading(false);
}, []);

const loginWithGoogle = async () => {
  try {
    setLoading(true);
    
    // For development, use mock users
    if (process.env.NODE_ENV === 'development') {
      // Use customer user as default for Google login in development
      const mockUser = mockUsers[0]; 
      const adminEmails = ['admin@example.com', 'arun.kumar@example.com'];
      const userWithMetadata = {
        ...mockUser,
        mockUser: true,
        loginTime: new Date().toISOString(),
        isAdmin: adminEmails.includes(mockUser.email)
      };
      
      setUser(userWithMetadata);
      localStorage.setItem('mockAuthUser', JSON.stringify(userWithMetadata));
      return userWithMetadata;
    }
    
    // Real Firebase implementation would go here
    const result = await auth.signInWithPopup(googleProvider);
    const adminEmails = ['admin@example.com', 'arun.kumar@example.com'];
    const userWithRole = {
      ...result.user,
      isAdmin: adminEmails.includes(result.user.email)
    };
    return userWithRole;
    
  } catch (error) {
    console.error('Google login error:', error);
    
    // Fallback for development
    if (process.env.NODE_ENV === 'development') {
      const mockUser = mockUsers[0];
      const adminEmails = ['admin@example.com', 'arun.kumar@example.com'];
      const userWithRole = {
        ...mockUser,
        isAdmin: adminEmails.includes(mockUser.email)
      };
      setUser(userWithRole);
      localStorage.setItem('mockAuthUser', JSON.stringify(userWithRole));
      setLoading(false);
      return userWithRole;
    }
    
    throw error;
  } finally {
    setLoading(false);
  }
};

const loginAsMockUser = async (userIndex = 0) => {
  if (process.env.NODE_ENV === 'development') {
    setLoading(true);
    try {
      const mockUser = mockUsers[userIndex];
      const adminEmails = ['admin@example.com', 'arun.kumar@example.com'];
      const userWithMetadata = {
        ...mockUser,
        mockUser: true,
        loginTime: new Date().toISOString(),
        isAdmin: adminEmails.includes(mockUser.email)
      };
      
      setUser(userWithMetadata);
      localStorage.setItem('mockAuthUser', JSON.stringify(userWithMetadata));
      
      return userWithMetadata;
    } finally {
      setLoading(false);
    }
  }
}; 

  const logout = async () => {
    try {
      setLoading(true);
      await auth.signOut();
      setUser(null);
      localStorage.removeItem('mockAuthUser');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Fallback for mock implementation
      if (process.env.NODE_ENV === 'development') {
        setUser(null);
        localStorage.removeItem('mockAuthUser');
        setLoading(false);
        return;
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loginWithGoogle,
    loginAsMockUser,
    logout,
    loading,
    isMock: process.env.NODE_ENV === 'development'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};