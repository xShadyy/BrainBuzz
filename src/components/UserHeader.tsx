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
  username: propUsername,
  xpCurrent: propXpCurrent,
  xpRequired: propXpRequired,
  onSettingsPress,
  onLogoutPress,
}) => {
  const {user} = useUser();
  const username = propUsername || user?.name || 'USER';

  const userXP = Math.min(user?.xp || 0, 9999);
  const userLevel = Math.min(user?.level || 1, 8);

  const currentLevelThreshold = db.getXPRequiredForLevel(userLevel - 1);
  const nextLevelThreshold = db.getXPRequiredForLevel(userLevel);

  const xpInCurrentLevel = userXP - currentLevelThreshold;
  const xpNeededForNextLevel = nextLevelThreshold - currentLevelThreshold;

  const xpCurrent =
    propXpCurrent !== undefined ? propXpCurrent : xpInCurrentLevel;
  const xpForCurrentLevel =
    propXpRequired !== undefined ? propXpRequired : xpNeededForNextLevel;

  const isMaxLevel = userLevel >= 8 && userXP >= 9999;
  const displayXpCurrent = isMaxLevel ? 9999 : xpCurrent;
  const displayXpForCurrentLevel = isMaxLevel ? 9999 : xpForCurrentLevel;

  const xpPercentage = isMaxLevel
    ? 100
    : Math.min(
        100,
        Math.max(0, (displayXpCurrent / displayXpForCurrentLevel) * 100),
      );

  const getFireAnimation = (level: number) => {
    const fireAnimations = [
      require('../assets/animations/fire_cherry_pink_light.json'),
      require('../assets/animations/fire_cherry_pink_lighter.json'),
      require('../assets/animations/fire_spring_green_light.json'),
      require('../assets/animations/fire_spring_green_lighter.json'),
      require('../assets/animations/fire_sky_blue_light.json'),
      require('../assets/animations/fire_sky_blue_lighter.json'),
      require('../assets/animations/fire_sunny_beige_light.json'),
      require('../assets/animations/fire_sunny_beige_lighter.json'),
    ];

    const clampedLevel = Math.max(1, Math.min(8, level));
    return fireAnimations[clampedLevel - 1];
  };
  const getLevelColor = (level: number) => {
    const levelColors = [
      '#BD3039',
      '#951C4C',
      '#50CB86',
      '#6EEB83',
      '#5DA9E9',
      '#4ECDC4',
      '#FF5C8D',
      '#FF6B6B',
    ];

    const clampedLevel = Math.max(1, Math.min(8, level));
    return levelColors[clampedLevel - 1];
  };

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
          <View style={styles.topRow}>
            <View style={styles.usernameContainer}>
              <Text
                style={[
                  styles.username,
                  {
                    opacity: 1,
                    color: getLevelColor(userLevel),
                    textShadowColor: `${getLevelColor(userLevel)}33`,
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {username ? username.toUpperCase() : 'USER'}
                <Text
                  style={{
                    color: 'transparent',
                    fontFamily: 'Supercharge-JRgPo',
                  }}>
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
                <View
                  style={[
                    styles.xpBarFill,
                    {
                      width: `${xpPercentage}%`,
                      backgroundColor: getLevelColor(userLevel),
                    },
                  ]}
                />
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
