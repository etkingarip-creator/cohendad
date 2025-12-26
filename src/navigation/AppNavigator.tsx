import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { RootStackParamList } from '../types';

// Onboarding Screens
import SplashScreen from '../screens/onboarding/SplashScreen';
import HookScreen from '../screens/onboarding/HookScreen';
import IntentionsScreen from '../screens/onboarding/IntentionsScreen';

// Auth Screens
import AuthScreen from '../screens/auth/AuthScreen';
import BirthDataScreen from '../screens/auth/BirthDataScreen';

// Main App
import MainTabNavigator from './MainTabNavigator';

// Premium Screens
import PaywallScreen from '../screens/premium/PaywallScreen';
import SubscriptionPlansScreen from '../screens/premium/SubscriptionPlansScreen';

// Result Screens
import ReadingResultScreen from '../screens/main/ReadingResultScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { userData, loading: userLoading } = useUser();

  if (authLoading || userLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0F0A1E' },
        }}
      >
        {!user ? (
          // Unauthenticated flow
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Hook" component={HookScreen} />
            <Stack.Screen name="Intentions" component={IntentionsScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
          </>
        ) : !userData?.birthData ? (
          // Authenticated but missing birth data
          <>
            <Stack.Screen name="BirthData" component={BirthDataScreen} />
          </>
        ) : (
          // Fully authenticated and onboarded
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          </>
        )}

        {/* Common screens accessible from anywhere */}
        <Stack.Screen name="Paywall" component={PaywallScreen} />
        <Stack.Screen name="SubscriptionPlans" component={SubscriptionPlansScreen} />
        <Stack.Screen name="ReadingResult" component={ReadingResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
