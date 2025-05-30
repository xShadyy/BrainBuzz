/**
 * BrainBuzz App
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { AppNavigator } from './src/navigation';
import SoundManager from './src/utils/SoundManager';
import { UserProvider } from './src/utils/UserContext';

LogBox.ignoreLogs([
  'Text strings must be rendered within a <Text> component',
]);

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
