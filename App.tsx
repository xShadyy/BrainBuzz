
/**
 * BrainBuzz App
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { AppNavigator } from './src/navigation';
import SoundManager from './src/utils/SoundManager';
import { UserProvider } from './src/utils/UserContext';

function App(): React.JSX.Element {
  useEffect(() => {
    // Set status bar to translucent for the entire app
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');

    console.log('App mounted, initializing ambient sound');

    // Initialize sound manager
    SoundManager.init().then(() => {
      // Start playing ambient music
      SoundManager.playAmbient();
    });

    return () => {
      console.log('App unmounted, stopping all sounds');
      SoundManager.release();
    };
  }, []);

  return (
    <UserProvider>
      <StatusBar translucent backgroundColor="transparent" />
      <AppNavigator />
    </UserProvider>
  );
}

export default App;
