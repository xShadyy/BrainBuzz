import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Alert,
  BackHandler,
} from 'react-native';
import { styles } from './DashboardScreen.styles.ts';
import LottieView from 'lottie-react-native';
import { db } from '../database';
import { UserHeader } from '../components/UserHeader';

interface DashboardScreenProps {
  userId: number;
  onLogout: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userId,
  onLogout,
}) => {
  const [userName, setUserName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await db.getUserById(userId);
        if (user && user.name) {
          setUserName(user.name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    // Handle back button press - prevents app exit on back press
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert('Confirm', 'Do you want to logout?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'Yes', onPress: () => onLogout() },
        ]);
        return true; // Prevent default behavior (app exit)
      }
    );

    return () => backHandler.remove();
  }, [userId, onLogout]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: onLogout,
      },
    ]);
  };

  const handleSettings = () => {
    // Settings functionality will be implemented later
    Alert.alert('Settings', 'Settings feature will be available soon!');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../assets/animations/lightning.json')}
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3C67B1" />

      {/* Background */}
      <View style={styles.backgroundContainer} />

      <View style={styles.dashboardLayout}>
        {/* User Header */}
        <UserHeader
          username={userName}
          onLogout={handleLogout}
          onSettings={handleSettings}
          level={1}
          xpCurrent={50}
          xpRequired={100}
        />

        {/* Main Content */}
        <View style={styles.mainContent}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
          >
            {/* Dashboard Content Sections */}
            <View style={styles.dashboardSection}>
              <Text style={styles.sectionTitle}>Activity Overview</Text>
              <View style={styles.sectionContent}>
                <Text style={styles.emptyStateText}>
                  Your activity stats will appear here
                </Text>
              </View>
            </View>

            <View style={styles.dashboardSection}>
              <Text style={styles.sectionTitle}>Recent Progress</Text>
              <View style={styles.sectionContent}>
                <Text style={styles.emptyStateText}>
                  Your recent progress will be tracked here
                </Text>
              </View>
            </View>

            <View style={styles.dashboardSection}>
              <Text style={styles.sectionTitle}>Upcoming Challenges</Text>
              <View style={styles.sectionContent}>
                <Text style={styles.emptyStateText}>
                  Your upcoming challenges will appear here
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>BrainBuzz • Dashboard v1.0</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
