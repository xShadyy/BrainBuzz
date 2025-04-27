import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, StatusBar} from 'react-native';
import {UserHeader} from '../components/UserHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useUser} from '../utils/UserContext';
import SoundManager from '../utils/SoundManager';
import {styles, configureStatusBar} from './QuizDisplay.styles';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type QuizDisplayProps = StackScreenProps<RootStackParamList, 'Quiz'>;

export const QuizDisplay: React.FC<QuizDisplayProps> = ({ navigation, route }) => {
  const { userId, category } = route.params;
  const {user, refreshUser} = useUser();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  // Fetch user data when component mounts and configure status bar
  useEffect(() => {
    configureStatusBar();

    const loadUserData = async () => {
      if (userId) {
        await refreshUser(userId);
      }
    };

    loadUserData();

    // Initialize sound manager
    SoundManager.init();

    return () => {
      // Clean up if needed
    };
  }, [userId, refreshUser]);

  const difficulties = [
    {
      id: 'hard',
      title: 'Hard',
      styleClass: styles.hardButton,
      multiplier: '3x',
      icon: 'whatshot',
    },
    {
      id: 'medium',
      title: 'Medium',
      styleClass: styles.mediumButton,
      multiplier: '2x',
      icon: 'bolt',
    },
    {
      id: 'easy',
      title: 'Easy',
      styleClass: styles.easyButton,
      multiplier: '1x',
      icon: 'stars',
    },
  ];

  const handleDifficultySelect = (difficulty: string) => {
    setSelectedDifficulty(difficulty);

    // Handle difficulty selection
    console.log(`Selected difficulty: ${difficulty} for category: ${category}`);

    // In a real implementation, you would probably navigate to a quiz game screen
    // navigation.navigate('QuizGame', { userId, category, difficulty });
  };

  const handleBackPress = () => {
    SoundManager.playInteraction();
    navigation.goBack();
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

  // Calculate some example XP for visual demonstration
  const userXpCurrent = user?.xp || 50;
  const userXpRequired = (user?.level || 1) * 100;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      {/* UserHeader with the currently logged-in user */}
      <UserHeader
        username={user?.name}
        xpCurrent={userXpCurrent}
        xpRequired={userXpRequired}
        onSettingsPress={handleOpenSettings}
        onLogoutPress={handleLogout}
      />

      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.difficultiesContainer}>
          <TouchableOpacity
            style={styles.backToCategoriesButton}
            onPress={handleBackPress}>
            <MaterialIcons name="arrow-back" size={20} color="#FFFFFF" />
            <Text style={styles.backToCategoriesText}>Back to Categories</Text>
          </TouchableOpacity>

          <Text style={styles.categoryText}>Quiz Category: {category}</Text>
          <Text style={styles.chooseText}>Choose Difficulty</Text>

          {difficulties.map(difficulty => (
            <TouchableOpacity
              key={difficulty.id}
              style={[
                styles.difficultyButton,
                difficulty.styleClass,
                selectedDifficulty === difficulty.id && styles.selectedDifficultyButton,
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
        </ScrollView>
      </View>
    </View>
  );
};
