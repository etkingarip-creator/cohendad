import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Icons - using simple View placeholders for now
// In production, use react-native-vector-icons or custom SVGs

// Screens - will be imported once created
// import HomeScreen from '../screens/main/HomeScreen';
// import TarotReadingScreen from '../screens/main/TarotReadingScreen';
// import HistoryScreen from '../screens/main/HistoryScreen';
// import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary.gold,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {/* Placeholder tabs - will be uncommented once screens are created */}
      {/* <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <View style={[styles.icon, { backgroundColor: color }]} />
          ),
        }}
      />
      <Tab.Screen
        name="TarotReading"
        component={TarotReadingScreen}
        options={{
          tabBarLabel: 'Tarot',
          tabBarIcon: ({ color, size }) => (
            <View style={[styles.icon, { backgroundColor: color }]} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => (
            <View style={[styles.icon, { backgroundColor: color }]} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <View style={[styles.icon, { backgroundColor: color }]} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background.card,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});

export default MainTabNavigator;
