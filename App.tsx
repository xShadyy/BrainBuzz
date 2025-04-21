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

function App(): React.JSX.Element {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // Single cross-fade transition between screens

  useEffect(() => {
    console.log('App mounted, initializing ambient sound');

    const timeoutId = setTimeout(() => {
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      console.log('App unmounted, stopping all sounds');
    };
  }, []);

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

  // No background color here - let each screen control its own background
  return (
    <>
      {/* Status bar is transparent to allow screen backgrounds to show through */}
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* No fade animation during screen changes - let the transition animation handle it */}
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
