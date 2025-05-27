import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { Easing, View, StyleSheet } from 'react-native';

// your screens…
import { WelcomeScreen } from '../screens/WelcomeScreen/WelcomeScreen';
import { LoginScreen } from '../screens/LoginScreen/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen/DashboardScreen';
import { DifficultySelectorScreen } from '../screens/DifficultySelectorScreen/DifficultySelectorScreen';
import { SettingsScreen } from '../screens/SettingsScreen/SettingsScreen';
import { QuizScreen } from '../screens/QuizScreen/QuizScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Dashboard: { userId: number; fromLogin?: boolean };
  Quiz: { userId: number; category: string };
  QuizScreen: {
    userId: number;
    categoryId: number;
    difficulty: string;
    category: string;
  };
  Settings: { userId: number };
};

const Stack = createStackNavigator<RootStackParamList>();

// match the app background to avoid any flashes
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000000', // Match your app's dark theme
  },
};

const screenOptions: StackNavigationOptions = {
  headerShown: false,
  gestureEnabled: true,

  // keep the previous screen mounted to avoid flicker
  detachPreviousScreen: false,

  // prevent any unmounting during transitions
  freezeOnBlur: true,

  // ensure the card bg never shows through
  cardStyle: {
    backgroundColor: '#000000', // Match your app's dark theme
    // Ensure no transparency whatsoever
    opacity: 1,
  },

  // use Android’s built-in "scale from center" transition
  cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,

  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 350,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 250,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      },
    },
  },
};

// Container styles to ensure solid background
const containerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

export const AppNavigator: React.FC = () => (
  <View style={containerStyles.container}>
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={screenOptions}
        screenListeners={{
          // Prevent any potential background flashes during transitions
          beforeRemove: () => {
            // Keep screen mounted during transition
          },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Quiz" component={DifficultySelectorScreen} />
        <Stack.Screen name="QuizScreen" component={QuizScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  </View>
);
