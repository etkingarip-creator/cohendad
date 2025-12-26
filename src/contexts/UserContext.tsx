import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, BirthData, Intention } from '../types';
import { useAuth } from './AuthContext';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

interface UserContextType {
  userData: User | null;
  loading: boolean;
  updateUserData: (data: Partial<User>) => Promise<void>;
  setBirthData: (birthData: BirthData) => Promise<void>;
  setIntentions: (intentions: Intention[]) => Promise<void>;
  incrementStreak: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    if (authUser) {
      loadUserData(authUser.uid);
    } else {
      setUserData(null);
      setLoading(false);
    }
  }, [authUser]);

  const loadUserData = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));

      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          id: userId,
          email: data.email,
          name: data.name,
          birthData: data.birthData,
          signupDate: data.signupDate?.toDate() || new Date(),
          isPremium: data.isPremium || false,
          subscriptionType: data.subscriptionType,
          trialEndsAt: data.trialEndsAt?.toDate(),
          lastActivityDate: data.lastActivityDate?.toDate(),
          streak: data.streak || 0,
          intentions: data.intentions || [],
        } as User);
      } else {
        // Create new user document
        const newUser: User = {
          id: userId,
          email: authUser?.email || '',
          name: authUser?.displayName || '',
          signupDate: new Date(),
          isPremium: false,
          streak: 0,
          intentions: [],
        };

        await setDoc(doc(db, 'users', userId), {
          ...newUser,
          signupDate: new Date(),
        });

        setUserData(newUser);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (data: Partial<User>) => {
    if (!authUser) return;

    try {
      await updateDoc(doc(db, 'users', authUser.uid), data);
      setUserData((prev) => (prev ? { ...prev, ...data } : null));
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  const setBirthData = async (birthData: BirthData) => {
    await updateUserData({ birthData });
  };

  const setIntentions = async (intentions: Intention[]) => {
    await updateUserData({ intentions });
  };

  const incrementStreak = async () => {
    if (!userData) return;

    const newStreak = userData.streak + 1;
    await updateUserData({
      streak: newStreak,
      lastActivityDate: new Date(),
    });
  };

  const value: UserContextType = {
    userData,
    loading,
    updateUserData,
    setBirthData,
    setIntentions,
    incrementStreak,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
