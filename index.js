/**
 * @format
 */

import {AppRegistry} from 'react-native';
import 'expo-asset';
import App from './App';
import {name as appName} from './app.json';
import {registerRootComponent} from 'expo';

registerRootComponent(App);
AppRegistry.registerComponent(appName, () => App);
