/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import SoundManager from '../utils/SoundManager';
import {styles, configureStatusBar} from './UserHeader.styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import {useUser} from '../utils/UserContext';
import {db} from '../database';

interface UserHeaderProps {
  username?: string;
  xpCurrent?: number;
  xpRequired?: number;
  onSettingsPress?: () => void;
  onLogoutPress?: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  username: propUsername, // Rename to avoid conflict with context username
  xpCurrent: propXpCurrent,
  xpRequired: propXpRequired,
  onSettingsPress,
  onLogoutPress,
}) => {
  const {user} = useUser(); // Get user from context
  const username = propUsername || user?.name || 'USER'; // Use prop username if provided, otherwise use context

  // Calculate actual XP values from user data or use provided props
  const userXP = Math.min(user?.xp || 0, 9999); // Cap XP at 9999
  const userLevel = Math.min(user?.level || 1, 8); // Cap level at 8

  // Get XP thresholds for current and next level
  const currentLevelThreshold = db.getXPRequiredForLevel(userLevel - 1); // XP needed for current level
  const nextLevelThreshold = db.getXPRequiredForLevel(userLevel); // XP needed for next level

  // Calculate XP progress within current level
  const xpInCurrentLevel = userXP - currentLevelThreshold;
  const xpNeededForNextLevel = nextLevelThreshold - currentLevelThreshold;

  // Use prop values if provided, otherwise calculate from user data
  const xpCurrent = propXpCurrent !== undefined ? propXpCurrent : xpInCurrentLevel;
  const xpForCurrentLevel = propXpRequired !== undefined ? propXpRequired : xpNeededForNextLevel;

  // Special handling for max level (Level 8) - show full XP bar
  const isMaxLevel = userLevel >= 8 && userXP >= 9999;
  const displayXpCurrent = isMaxLevel ? 9999 : xpCurrent;
  const displayXpForCurrentLevel = isMaxLevel ? 9999 : xpForCurrentLevel;

  // Calculate XP percentage for the progress bar
  const xpPercentage = isMaxLevel ? 100 : Math.min(
    100,
    Math.max(0, (displayXpCurrent / displayXpForCurrentLevel) * 100),
  );

  // Get fire animation based on user level (Level 1 = highest fire, Level 8 = lowest fire)
  const getFireAnimation = (level: number) => {
    const fireAnimations = [
      require('../assets/animations/fire_cherry_pink_light.json'), // Level 1 (highest)
      require('../assets/animations/fire_cherry_pink_lighter.json'), // Level 2
      require('../assets/animations/fire_spring_green_light.json'), // Level 3
      require('../assets/animations/fire_spring_green_lighter.json'), // Level 4
      require('../assets/animations/fire_sky_blue_light.json'), // Level 5
      require('../assets/animations/fire_sky_blue_lighter.json'), // Level 6
      require('../assets/animations/fire_sunny_beige_light.json'), // Level 7
      require('../assets/animations/fire_sunny_beige_lighter.json'), // Level 8 (lowest)
    ];

    // Clamp level between 1-8 and convert to array index (0-7)
    const clampedLevel = Math.max(1, Math.min(8, level));
    return fireAnimations[clampedLevel - 1];
  };

  // Get color for current level's XP bar
  const getLevelColor = (level: number) => {
    const levelColors = [
      '#FFFFFF', // Level 1 - Eternal Storm (white)
      '#A9B7C0', // Level 2 - Mystical Aura (gray)
      '#50CB86', // Level 3 - Jade Pyre (green)
      '#6EEB83', // Level 4 - Emerald Inferno (light green)
      '#5DA9E9', // Level 5 - Sapphire Blaze (blue)
      '#4ECDC4', // Level 6 - Azure Flame (cyan)
      '#FF5C8D', // Level 7 - Sun Flame (pink)
      '#FF6B6B', // Level 8 - Ember Spark (red)
    ];

    // Clamp level between 1-8 and convert to array index (0-7)
    const clampedLevel = Math.max(1, Math.min(8, level));
    return levelColors[clampedLevel - 1];
  };

  // Configure status bar to match header color
  useEffect(() => {
    configureStatusBar();
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
                style={[
                  styles.username,
                  {
                    opacity: 1,
                    color: getLevelColor(userLevel),
                    textShadowColor: `${getLevelColor(userLevel)}33`, // Add 33 for 20% opacity
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {username ? username.toUpperCase() : 'USER'}
                <Text style={{color: 'transparent', fontFamily: 'Supercharge-JRgPo'}}>
                  {' '}
                </Text>
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
                source={getFireAnimation(userLevel)}
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
                <View style={[styles.xpBarFill, {width: `${xpPercentage}%`, backgroundColor: getLevelColor(userLevel)}]} />
              </View>
              <Text style={styles.xpText}>
                {displayXpCurrent}/{displayXpForCurrentLevel} XP
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
