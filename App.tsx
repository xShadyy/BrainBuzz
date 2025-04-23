/* eslint-disable no-lone-blocks */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {WelcomeScreen} from './src/screens/WelcomeScreen';
import {LoginScreen} from './src/screens/LoginScreen';
import {DashboardScreen} from './src/screens/DashboardScreen';
import SoundManager from './src/utils/SoundManager';

function App(): React.JSX.Element {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Set status bar to translucent for the entire app
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');

    console.log('App mounted, initializing ambient sound');

    {
      SoundManager.init().then(() => {
        // Start playing ambient music if not logged in
        if (!isLoggedIn) {
          SoundManager.playAmbient();
        } else {
          // Make sure ambient is stopped when going directly to dashboard
          SoundManager.fadeOutAmbient();
        }
      });
    }

    return () => {
      console.log('App unmounted, stopping all sounds');
      SoundManager.release();
    };
  }, [showWelcome, isLoggedIn]);

  // This function is called when WelcomeScreen's transition animation completes
  const handleWelcomeFinish = () => {
    // Immediately switch to login screen without a fade animation
    setShowWelcome(false);
  };

  // Handle successful login
  const handleLoginSuccess = (loggedInUserId: number) => {
    // The login success sound is already played in LoginScreen.tsx
    // No need to play it again here

    setUserId(loggedInUserId);
    setIsLoggedIn(true);
  };

  // Handle logout
  const handleLogout = () => {
    // Restart ambient music when logging out
    SoundManager.playAmbient();

    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      {/* Add StatusBar component at app level */}
      <StatusBar translucent backgroundColor="transparent" />

      {showWelcome ? (
        <WelcomeScreen onFinish={handleWelcomeFinish} />
      ) : isLoggedIn && userId ? (
        <DashboardScreen userId={userId} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
