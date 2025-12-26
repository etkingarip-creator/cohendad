import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { RootStackParamList } from '../types';

// Screens - will be imported once created
// import SplashScreen from '../screens/onboarding/SplashScreen';
// import HookScreen from '../screens/onboarding/HookScreen';
// import IntentionsScreen from '../screens/onboarding/IntentionsScreen';
// import AuthScreen from '../screens/auth/AuthScreen';
// import BirthDataScreen from '../screens/auth/BirthDataScreen';
// import MainTabNavigator from './MainTabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { userData, loading: userLoading } = useUser();

  if (authLoading || userLoading) {
    // return <SplashScreen />;
    return null; // Placeholder until SplashScreen is created
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
            {/* <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Hook" component={HookScreen} />
            <Stack.Screen name="Intentions" component={IntentionsScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} /> */}
          </>
        ) : !userData?.birthData ? (
          // Authenticated but missing birth data
          <>
            {/* <Stack.Screen name="BirthData" component={BirthDataScreen} /> */}
          </>
        ) : (
          // Fully authenticated and onboarded
          <>
            {/* <Stack.Screen name="MainTabs" component={MainTabNavigator} /> */}
          </>
        )}

        {/* Common screens accessible from anywhere */}
        {/* <Stack.Screen name="Paywall" component={PaywallScreen} />
        <Stack.Screen name="SubscriptionPlans" component={SubscriptionPlansScreen} />
        <Stack.Screen name="ReadingResult" component={ReadingResultScreen} />
        <Stack.Screen name="DreamEntry" component={DreamEntryScreen} />
        <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
