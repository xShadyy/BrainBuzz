/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import SoundManager from '../utils/SoundManager';
import {styles, configureStatusBar} from './UserHeader.styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import {useUser} from '../utils/UserContext';
import {Settings} from '../screens/Settings';

interface UserHeaderProps {
  username?: string;
  xpCurrent?: number;
  xpRequired?: number;
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  username: propUsername, // Rename to avoid conflict with context username
  xpCurrent = 50,
  xpRequired = 100,
}) => {
  const {user, logout} = useUser(); // Get user and logout function from context
  const username = propUsername || user?.name || 'USER'; // Use prop username if provided, otherwise use context
  const [showSettings, setShowSettings] = useState(false);

  // Calculate XP percentage for the progress bar
  const xpPercentage = Math.min(
    100,
    Math.max(0, (xpCurrent / xpRequired) * 100),
  );

  // Configure status bar to match header color
  useEffect(() => {
    configureStatusBar();

    // Ensure ambient sound is playing when component mounts
    // Using a try-catch to prevent any errors from breaking the component
    try {
      // Initialize sound manager without waiting for the promise
      SoundManager.init();

      // Use setTimeout to prevent immediate state updates that could trigger the useInsertionEffect error
      const timer = setTimeout(() => {
        SoundManager.playAmbient();
      }, 100);

      return () => {
        clearTimeout(timer);
        // Reset status bar if needed when component unmounts
      };
    } catch (error) {
      console.error('Error initializing sound manager:', error);
      // Don't throw errors that would cause component rendering issues
      return () => {
        // Reset status bar if needed when component unmounts
      };
    }
  }, []);

  const handleSettingsPress = () => {
    SoundManager.playInteraction();
    setShowSettings(true);
  };

  const handleLogoutPress = () => {
    SoundManager.playInteraction();
    Alert.alert('Confirm', 'Do you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Yes', onPress: () => logout?.()},
    ]);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  return (
    <View style={styles.container}>
      {showSettings ? (
        <Settings userId={user?.id || 0} onBack={handleCloseSettings} />
      ) : (
        <View style={styles.headerContent}>
          <View style={styles.userInfoContainer}>
            {/* Top row with username and action icons */}
            <View style={styles.topRow}>
              <View style={styles.usernameContainer}>
                <Text
                  style={[styles.username, {opacity: 1}]}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {username ? username.toUpperCase() : 'USER'}
                </Text>
              </View>
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  onPress={handleSettingsPress}
                  style={{marginRight: 16, padding: 5}}>
                  <MaterialIcons name="settings" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleLogoutPress}
                  style={{padding: 5}}>
                  <MaterialIcons name="logout" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.levelContainer}>
              <View style={styles.levelEffect}>
                <LottieView
                  source={require('../assets/animations/fire_cherry_pink_light.json')}
                  autoPlay
                  loop
                  style={{
                    width: 48,
                    height: 48,
                  }}
                />
              </View>
              <View style={styles.xpContainer}>
                <View style={styles.xpBarBackground}>
                  <View style={[styles.xpBarFill, {width: `${xpPercentage}%`}]} />
                </View>
                <Text style={styles.xpText}>
                  {xpCurrent}/{xpRequired} XP
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
