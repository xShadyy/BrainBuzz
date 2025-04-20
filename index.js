/**
 * @format
 */

import {AppRegistry} from 'react-native';
import Sound from 'react-native-sound';
import App from './App';
import {name as appName} from './app.json';

Sound.setCategory('Playback');
Sound.setMode('STATIC');

AppRegistry.registerComponent(appName, () => App);
