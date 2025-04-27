import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, StatusBar} from 'react-native';
import {UserHeader} from '../../components/UserHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useUser} from '../../utils/UserContext';
import SoundManager from '../../utils/SoundManager';
import {styles, configureStatusBar} from './DifficultySelectorScreen.styles';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type DifficultySelectorScreenProps = StackScreenProps<RootStackParamList, 'Quiz'>;

export const DifficultySelectorScreen: React.FC<DifficultySelectorScreenProps> = ({ navigation, route }) => {
  const { userId, category } = route.params;
  const {user, refreshUser} = useUser();
  const [categoryId, setCategoryId] = useState<number | null>(null);

  // Fetch user data when component mounts and configure status bar
  useEffect(() => {
    configureStatusBar();

    const loadUserData = async () => {
      if (userId) {
        await refreshUser(userId);
      }
    };

    // Load the categories to get the correct category ID
    const loadCategoryId = async () => {
      try {
        const categoriesData = require('../../../android/app/src/main/assets/quiz_data/categories.json');
        const foundCategory = categoriesData.find((cat: any) => cat.name === category);
        if (foundCategory) {
          setCategoryId(foundCategory.id);
        }
      } catch (error) {
        console.error('Failed to load category ID:', error);
      }
    };

    loadUserData();
    loadCategoryId();

    // Initialize sound manager
    SoundManager.init();

    return () => {
      // Clean up if needed
    };
  }, [userId, refreshUser, category]);

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
      alert('Unable to load category information. Please try again.');
    }
  };

  const handleBackPress = () => {
    SoundManager.playInteraction();
    navigation.navigate('Dashboard', { userId });
  };

  const handleLogout = () => {
    SoundManager.playInteraction();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleOpenSettings = () => {
    navigation.navigate('Settings', { userId: userId });
  };

  const userXpCurrent = user?.xp || 50;
  const userXpRequired = (user?.level || 1) * 100;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <UserHeader
        username={user?.name}
        xpCurrent={userXpCurrent}
        xpRequired={userXpRequired}
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
              style={[
                styles.difficultyButton,
                difficulty.styleClass,
              ]}
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

function alert(_arg0: string) {
  throw new Error('Function not implemented.');
}

