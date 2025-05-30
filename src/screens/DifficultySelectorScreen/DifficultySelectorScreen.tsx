import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import {UserHeader} from '../../components/UserHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useUser} from '../../utils/UserContext';
import {useFocusEffect} from '@react-navigation/native';
import SoundManager from '../../utils/SoundManager';
import {styles, configureStatusBar} from './DifficultySelectorScreen.styles';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/AppNavigator';

type DifficultySelectorScreenProps = StackScreenProps<
  RootStackParamList,
  'Quiz'
>;

export const DifficultySelectorScreen: React.FC<
  DifficultySelectorScreenProps
> = ({navigation, route}) => {
  const {userId, category, categoryId} = route.params;
  const {user, refreshUser} = useUser();
  // Extract loadUserData to a useCallback for memoization
  const loadUserData = useCallback(async () => {
    if (userId) {
      await refreshUser(userId);
    }
  }, [userId, refreshUser]);

  // Refresh user data when screen comes into focus (e.g., returning from QuizScreen)
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        refreshUser(userId);
      }
    }, [userId, refreshUser]),
  );
  // Fetch user data when component mounts and configure status bar
  useEffect(() => {
    configureStatusBar();
    loadUserData();

    // Initialize sound manager
    SoundManager.init();

    return () => {
      // Clean up if needed
    };
  }, [loadUserData]); // Depend on memoized callback

  const difficulties = [
    {
      id: 'HARD',
      title: 'Hard',
      styleClass: styles.hardButton,
      multiplier: '3x',
      icon: 'whatshot',
    },
    {
      id: 'MEDIUM',
      title: 'Medium',
      styleClass: styles.mediumButton,
      multiplier: '2x',
      icon: 'bolt',
    },
    {
      id: 'EASY',
      title: 'Easy',
      styleClass: styles.easyButton,
      multiplier: '1x',
      icon: 'stars',
    },
  ];

  const handleDifficultySelect = (difficulty: string) => {
    SoundManager.playInteraction();

    // Navigate to QuizScreen instead of showing Quiz component directly
    if (categoryId) {
      navigation.navigate('QuizScreen', {
        userId,
        categoryId,
        difficulty,
        category,
      });
    } else {
      Alert.alert(
        'Error',
        'Unable to load category information. Please try again.',
      );
    }
  };

  const handleBackPress = () => {
    SoundManager.playInteraction();
    navigation.navigate('Dashboard', {userId});
  };

  const handleLogout = () => {
    SoundManager.playInteraction();
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  const handleOpenSettings = () => {
    navigation.navigate('Settings', {userId: userId});
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <UserHeader
        username={user?.name}
        onSettingsPress={handleOpenSettings}
        onLogoutPress={handleLogout}
      />

      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.difficultiesContainer}>
          <Text style={styles.categoryText}>Quiz Category: {category}</Text>
          <Text style={styles.chooseText}>Choose Difficulty</Text>

          {difficulties.map(difficulty => (
            <TouchableOpacity
              key={difficulty.id}
              style={[styles.difficultyButton, difficulty.styleClass]}
              onPress={() => handleDifficultySelect(difficulty.id)}>
              <View style={styles.difficultyIconContainer}>
                <MaterialIcons
                  name={difficulty.icon}
                  size={28}
                  color="#FFFFFF"
                  style={styles.difficultyIcon}
                />
                <Text style={styles.difficultyText}>{difficulty.title}</Text>
              </View>
              <View style={styles.multiplierContainer}>
                <Text style={styles.multiplierText}>
                  {difficulty.multiplier}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.backToCategoriesButton}
            onPress={handleBackPress}>
            <MaterialIcons name="arrow-back" size={20} color="#FFFFFF" />
            <Text style={styles.backToCategoriesText}>Back to Categories</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};
