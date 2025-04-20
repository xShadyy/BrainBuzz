/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import {SafeAreaView, StatusBar, useColorScheme, View} from 'react-native';
import {WelcomeScreen} from './src/screens/WelcomeScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    console.log('App mounted, initializing ambient sound');

    const timeoutId = setTimeout(() => {
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      console.log('App unmounted, stopping all sounds');
    };
  }, []);

  const handleWelcomeFinish = () => {
    setShowWelcome(false);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF'}}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#1C1C1E' : '#FFFFFF'}
      />
      <View style={{flex: 1}}>
        {showWelcome ? (
          <WelcomeScreen onFinish={handleWelcomeFinish} />
        ) : (
          null
        )}
      </View>
    </SafeAreaView>
  );
}

export default App;
