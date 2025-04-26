import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, StatusBar} from 'react-native';
import {UserHeader} from '../components/UserHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useUser} from '../utils/UserContext';
import SoundManager from '../utils/SoundManager';
import {styles, configureStatusBar} from './QuizDisplay.styles';

interface QuizDisplayProps {
  userId: number;
  onBack: () => void;
  category: string;
  onSelectDifficulty: (difficulty: string) => void;
  onLogout?: () => void; // Kept for backward compatibility
}

export const QuizDisplay: React.FC<QuizDisplayProps> = ({
  userId,
  onBack,
  category,
  onSelectDifficulty,
}) => {
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
    {id: 'easy', title: 'Easy', color: '#4CAF50'},
    {id: 'medium', title: 'Medium', color: '#FF9800'},
    {id: 'hard', title: 'Hard', color: '#F44336'},
  ];

  const handleDifficultySelect = (difficulty: string) => {
    SoundManager.playInteraction();
    setSelectedDifficulty(difficulty);
    onSelectDifficulty(difficulty);
  };

  const handleBackPress = () => {
    SoundManager.playInteraction();
    onBack();
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
      />

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backButton}
            accessibilityLabel="Go back">
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.categoryTitle}>{category} Quiz</Text>
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionText}>
            Choose a difficulty level to start the quiz
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.difficultiesContainer}>
          {difficulties.map(difficulty => (
            <TouchableOpacity
              key={difficulty.id}
              style={[
                styles.difficultyButton,
                {backgroundColor: difficulty.color},
                selectedDifficulty === difficulty.id && styles.selectedDifficulty,
              ]}
              onPress={() => handleDifficultySelect(difficulty.id)}>
              <Text style={styles.difficultyText}>{difficulty.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
