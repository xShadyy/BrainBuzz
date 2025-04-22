/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import {StatusBar} from 'react-native';
import {WelcomeScreen} from './src/screens/WelcomeScreen';
import {LoginScreen} from './src/screens/LoginScreen';
import {DashboardScreen} from './src/screens/DashboardScreen';
import SoundManager from './src/utils/SoundManager';

function App(): React.JSX.Element {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  // Add state for StatusBar styling
  const [statusBarStyle, setStatusBarStyle] = useState<'light-content' | 'dark-content'>('light-content');
  const [statusBarBgColor, setStatusBarBgColor] = useState('transparent');
  const [statusBarTranslucent, setStatusBarTranslucent] = useState(true);

  useEffect(() => {
    console.log('App mounted, initializing ambient sound');

    // Set appropriate StatusBar configuration based on current screen
    if (showWelcome) {
      // WelcomeScreen status bar settings
      setStatusBarStyle('light-content');
      setStatusBarBgColor('transparent');
      setStatusBarTranslucent(true);
    } else if (isLoggedIn) {
      // DashboardScreen status bar settings
      setStatusBarStyle('light-content');
      setStatusBarBgColor('#3C67B1');
      setStatusBarTranslucent(false);
    } else {
      // LoginScreen status bar settings
      setStatusBarStyle('light-content');
      setStatusBarBgColor('transparent');
      setStatusBarTranslucent(true);
    }

    const timeoutId = setTimeout(() => {
      // Initialize sound manager
      SoundManager.init();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      console.log('App unmounted, stopping all sounds');
      SoundManager.release();
    };
  }, [showWelcome, isLoggedIn]);

  // This function is called when WelcomeScreen's transition animation completes
  const handleWelcomeFinish = () => {
    // Immediately switch to login screen without a fade animation
    // The transition animation from WelcomeScreen will continue into LoginScreen
    setShowWelcome(false);
  };

  // Handle successful login
  const handleLoginSuccess = (loggedInUserId: number) => {
    setUserId(loggedInUserId);
    setIsLoggedIn(true);
  };

  // Handle logout
  const handleLogout = () => {
    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
    <>
      {/* Dynamic StatusBar that adapts to each screen */}
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarBgColor}
        translucent={statusBarTranslucent}
      />

      {showWelcome ? (
        <WelcomeScreen onFinish={handleWelcomeFinish} />
      ) : isLoggedIn && userId ? (
        <DashboardScreen userId={userId} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;
