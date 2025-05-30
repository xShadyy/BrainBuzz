import { DefaultTheme } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const navigationTheme = {
  ...DefaultTheme,
};

export const defaultNavOptions: NativeStackNavigationOptions = {
  headerShown: false,
  gestureEnabled: true,
  presentation: 'transparentModal',
  animation: 'slide_from_bottom',
};
