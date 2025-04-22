/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  BackHandler,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import {styles} from './DashboardScreen.styles';
import LottieView from 'lottie-react-native';
import {db} from '../database';
import {UserHeader} from '../components/UserHeader';
import SoundManager from '../utils/SoundManager';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Settings} from './Settings';

interface CategoryItem {
  id: number;
  title: string;
  iconName: string;
  iconColor: string;
}

interface DashboardScreenProps {
  userId: number;
  onLogout: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userId,
  onLogout,
}) => {
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const settingsAnimation = useState(new Animated.Value(0))[0];

  const categoryItems: CategoryItem[] = [
    {id: 1, title: 'Math', iconName: 'calculate', iconColor: '#FF6B6B'},
    {id: 2, title: 'Science', iconName: 'science', iconColor: '#4ECDC4'},
    {id: 3, title: 'History', iconName: 'history-edu', iconColor: '#FFD166'},
    {id: 4, title: 'Geography', iconName: 'public', iconColor: '#6B5B95'},
    {id: 5, title: 'Languages', iconName: 'translate', iconColor: '#88D8B0'},
    {id: 6, title: 'Literature', iconName: 'menu-book', iconColor: '#F6AE2D'},
    {id: 7, title: 'Art', iconName: 'palette', iconColor: '#F25F5C'},
    {id: 8, title: 'Music', iconName: 'music-note', iconColor: '#247BA0'},
    {id: 9, title: 'Technology', iconName: 'memory', iconColor: '#70C1B3'},
    {
      id: 10,
      title: 'Sports',
      iconName: 'sports-basketball',
      iconColor: '#B2DBBF',
    },
    {id: 11, title: 'Health', iconName: 'favorite', iconColor: '#FF9F1C'},
    {
      id: 12,
      title: 'Daily Quiz',
      iconName: 'help-outline',
      iconColor: '#E76F51',
    },
    {
      id: 13,
      title: 'Challenges',
      iconName: 'emoji-events',
      iconColor: '#2A9D8F',
    },
    {
      id: 14,
      title: 'Leaderboard',
      iconName: 'leaderboard',
      iconColor: '#9B5DE5',
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await db.getUserById(userId);
        if (user?.name) {
          console.log('Username:', user.name); // Debug log
          setUserName(user.name);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();

    SoundManager.fadeOutAmbient();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert('Confirm', 'Do you want to logout?', [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Yes', onPress: onLogout},
        ]);
        return true;
      },
    );

    return () => backHandler.remove();
  }, [userId, onLogout]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', onPress: onLogout},
    ]);
  };

  const handleSettings = () => {
    SoundManager.playInteraction();
    setShowSettings(true);
    Animated.timing(settingsAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSettingsBack = () => {
    Animated.timing(settingsAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowSettings(false);
    });
  };

  const handleItemPress = (itemId: number) => {
    const title = categoryItems.find(i => i.id === itemId)?.title;
    Alert.alert('Category Selected', `You selected the ${title} category`);
  };

  const renderCategoryItem = ({item}: {item: CategoryItem}) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => handleItemPress(item.id)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.title}`}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={item.iconName} size={50} color={item.iconColor} />
        <Text style={styles.categoryText}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

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
      <View style={styles.backgroundContainer} />

      <Animated.View
        style={[
          styles.dashboardLayout,
          {
            opacity: settingsAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
            transform: [
              {
                translateX: settingsAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -50],
                }),
              },
            ],
          },
        ]}>
        <UserHeader
          username={userName}
          onLogout={handleLogout}
          onSettings={handleSettings}
          xpCurrent={50}
          xpRequired={100}
        />

        <FlatList
          data={categoryItems}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          style={{
            flex: 1,
            marginTop: 150, // Adjusted to make room for header plus XP bar
          }}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.gridRow}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>BrainBuzz • Dashboard v1.0</Text>
        </View>
      </Animated.View>

      {showSettings && (
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            opacity: settingsAnimation,
            transform: [
              {
                translateX: settingsAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          }}>
          <Settings userId={userId} onBack={handleSettingsBack} />
        </Animated.View>
      )}
    </View>
  );
};
