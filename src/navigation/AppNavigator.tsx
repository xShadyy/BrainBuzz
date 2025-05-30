import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {WelcomeScreen} from '../screens/WelcomeScreen/WelcomeScreen';
import {LoginScreen} from '../screens/LoginScreen/LoginScreen';
import {DashboardScreen} from '../screens/DashboardScreen/DashboardScreen';
import {DifficultySelectorScreen} from '../screens/DifficultySelectorScreen/DifficultySelectorScreen';
import {QuizScreen} from '../screens/QuizScreen/QuizScreen';
import {SettingsScreen} from '../screens/SettingsScreen/SettingsScreen';

import {navigationTheme, defaultNavOptions} from './config';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Dashboard: {userId: number; fromLogin?: boolean};
  Quiz: {userId: number; category: string};
  QuizScreen: {
    userId: number;
    categoryId: number;
    difficulty: string;
    category: string;
  };
  Settings: {userId: number};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => (
  <NavigationContainer theme={navigationTheme}>
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={defaultNavOptions}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Quiz" component={DifficultySelectorScreen} />
      <Stack.Screen name="QuizScreen" component={QuizScreen} />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          animation: 'slide_from_right',
          presentation: 'transparentModal',
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
