/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import SoundManager from '../utils/SoundManager';
import {styles, configureStatusBar} from './UserHeader.styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import {useUser} from '../utils/UserContext';

interface UserHeaderProps {
  username?: string;
  xpCurrent?: number;
  xpRequired?: number;
  onSettingsPress?: () => void;
  onLogoutPress?: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  username: propUsername, // Rename to avoid conflict with context username
  xpCurrent = 50,
  xpRequired = 100,
  onSettingsPress,
  onLogoutPress,
}) => {
  const {user} = useUser(); // Get user from context
  const username = propUsername || user?.name || 'USER'; // Use prop username if provided, otherwise use context

  // Calculate XP percentage for the progress bar
  const xpPercentage = Math.min(
    100,
    Math.max(0, (xpCurrent / xpRequired) * 100),
  );

  // Configure status bar to match header color
  useEffect(() => {
    configureStatusBar();

    const timer = setTimeout(() => {
      try {
        SoundManager.init(); // now it's delayed properly
        SoundManager.playAmbient();
      } catch (error) {
        console.error('Error initializing sound manager:', error);
      }
    }, 50); // small delay (~50ms)

    return () => {
      clearTimeout(timer); // cleanup in case component unmounts quickly
    };
  }, []);

  const handleSettingsPress = () => {
    SoundManager.playInteraction();
    if (onSettingsPress) {
      onSettingsPress();
    }
  };

  const handleLogoutPress = () => {
    SoundManager.playInteraction();
    Alert.alert('Confirm', 'Do you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Yes',
        onPress: () => {
          if (onLogoutPress) {
            onLogoutPress();
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};
