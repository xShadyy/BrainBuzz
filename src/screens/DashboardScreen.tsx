import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { styles } from './DashboardScreen.styles.ts';
import LottieView from 'lottie-react-native';
import { db } from '../database';

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
  }, [userId]);

  const handleLogout = () => {
    onLogout();
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E8EFF5" />

      {/* Pale color background instead of animation */}
      <View style={styles.backgroundContainer} />

      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

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
    </SafeAreaView>
  );
};
