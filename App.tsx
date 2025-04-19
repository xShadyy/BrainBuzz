/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {SafeAreaView, StatusBar, useColorScheme, View} from 'react-native';
import {AuthScreen} from './src/screens/AuthScreen';
import {SplashScreen} from './src/screens/SplashScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF'}}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#1C1C1E' : '#FFFFFF'}
      />
      <View style={{flex: 1}}>
        {showSplash ? (
          <SplashScreen onFinish={handleSplashFinish} />
        ) : (
          <AuthScreen />
        )}
      </View>
    </SafeAreaView>
  );
}

export default App;
