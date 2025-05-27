/**
 * BrainBuzz App
 *
 * @format
 */

import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {AppNavigator} from './src/navigation';
import SoundManager from './src/utils/SoundManager';
import {UserProvider} from './src/utils/UserContext';

function App(): React.JSX.Element {
  useEffect(() => {
    SoundManager.init().then(() => {
      SoundManager.playAmbient();
    });

    return () => {
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
