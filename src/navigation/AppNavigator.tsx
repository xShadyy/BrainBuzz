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
    background: 'transparent', // Make navigation background transparent
  },
};

const screenOptions: StackNavigationOptions = {
  headerShown: false,
  gestureEnabled: true,

  // Keep both screens mounted so transparency works
  detachPreviousScreen: false,

  // prevent any unmounting during transitions
  freezeOnBlur: true,

  // Make cards translucent/transparent
  cardStyle: {
    backgroundColor: 'rgba(40, 40, 40, 0.7)', // Semi-transparent overlay
    opacity: 1,
  },

  // Show underlying screens
  presentation: 'transparentModal',

  // Disable the dim overlay for pure translucency
  cardOverlayEnabled: false,

  // Use Android's slide from bottom transition for dramatic effect
  cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid,

  transitionSpec: {
    open: {
      animation: 'spring',
      config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 200,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      },
    },
  },
};

// Container styles to ensure transparent background
const containerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282828', // Base background for the navigator
  },
});

export const AppNavigator: React.FC = () => (
  <View style={containerStyles.container}>
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={screenOptions}
        screenListeners={{
          // Enhanced transition handling
          focus: () => {
            // Screen is focused
          },
          blur: () => {
            // Screen loses focus but stays mounted
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
    </NavigationContainer>  </View>
);
