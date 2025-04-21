import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SoundManager from '../utils/SoundManager';
import { styles } from './UserHeader.styles';

interface UserHeaderProps {
  username: string;
  onLogout: () => void;
  onSettings: () => void;
  // These will be implemented later
  level?: number;
  xpCurrent?: number;
  xpRequired?: number;
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  username,
  onLogout,
  onSettings,
  level = 1,
  xpCurrent = 50,
  xpRequired = 100,
}) => {
  // Calculate XP percentage for the progress bar
  const xpPercentage = Math.min(100, Math.max(0, (xpCurrent / xpRequired) * 100));

  const handleSettingsPress = () => {
    SoundManager.playInteraction();
    onSettings();
  };

  const handleLogoutPress = () => {
    SoundManager.playInteraction();
    onLogout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        {/* User info section */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.username}>{username.toUpperCase()}</Text>

          <View style={styles.levelContainer}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{level}</Text>
            </View>
            <View style={styles.xpContainer}>
              <View style={styles.xpBarBackground}>
                <View
                  style={[
                    styles.xpBarFill,
                    { width: `${xpPercentage}%` },
                  ]}
                />
              </View>
              <Text style={styles.xpText}>{xpCurrent}/{xpRequired} XP</Text>
            </View>
          </View>
        </View>

        {/* Actions section */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleSettingsPress}
            activeOpacity={0.7}
            testID="settingsButton"
          >
            <MaterialIcons name="settings" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleLogoutPress}
            activeOpacity={0.7}
            testID="logoutButton"
          >
            <MaterialIcons name="logout" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
