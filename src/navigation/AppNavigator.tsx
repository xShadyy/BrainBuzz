import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import { Easing, Animated } from 'react-native';

import { WelcomeScreen } from '../screens/WelcomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

// TESTING MODE: Set to true to skip welcome and login screens
const TEST_MODE = true; // Toggle this for testing

// Define the parameter types for each screen
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Dashboard: { userId: number };
  Quiz: { userId: number; category: string };
  Settings: { userId: number };
};

const Stack = createStackNavigator<RootStackParamList>();

const ScaleFromCenterAndroid = {
  cardStyleInterpolator: ({ current: { progress } }: {
    current: { progress: Animated.AnimatedInterpolation<number> }
  }) => {
    return {
      cardStyle: {
        opacity: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
        transform: [
          {
            scale: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
              extrapolate: 'clamp',
            }),
          },
        ],
      },
      overlayStyle: {
        opacity: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
          extrapolate: 'clamp',
        }),
      },
    };
  },
};

const screenOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyleInterpolator: ScaleFromCenterAndroid.cardStyleInterpolator,
  transitionSpec: {
    open: {
      animation: 'timing' as const,
      config: {
        duration: 600,
        easing: Easing.out(Easing.poly(4)),
      },
    },
    close: {
      animation: 'timing' as const,
      config: {
        duration: 200,
        easing: Easing.in(Easing.poly(4)),
      },
    },
  },
};

export const AppNavigator: React.FC = () => {
  // Default user ID for testing
  const testUserId = 1;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={TEST_MODE ? 'Dashboard' : 'Welcome'}
        screenOptions={screenOptions}>
        {!TEST_MODE && <Stack.Screen name="Welcome" component={WelcomeScreen} />}
        {!TEST_MODE && <Stack.Screen name="Login" component={LoginScreen} />}
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          initialParams={TEST_MODE ? { userId: testUserId } : undefined}
        />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
