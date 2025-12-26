import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { initializeApp } from 'firebase/app';
import { AuthProvider } from './src/contexts/AuthContext';
import { UserProvider } from './src/contexts/UserContext';
import { PremiumProvider } from './src/contexts/PremiumContext';
import AppNavigator from './src/navigation/AppNavigator';

// Firebase configuration
// In production, these should come from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || '',
};

// Initialize Firebase
if (firebaseConfig.apiKey) {
  initializeApp(firebaseConfig);
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <PremiumProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </PremiumProvider>
      </UserProvider>
    </AuthProvider>
  );
}
