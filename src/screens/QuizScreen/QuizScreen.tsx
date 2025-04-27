import React, { useEffect, useState } from 'react';
import { View, StatusBar, Text, TouchableOpacity, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Quiz from '../../components/Quiz';
import { UserHeader } from '../../components/UserHeader';
import { useUser } from '../../utils/UserContext';
import SoundManager from '../../utils/SoundManager';
import { styles, configureStatusBar } from './QuizScreen.styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type QuizScreenProps = StackScreenProps<RootStackParamList, 'QuizScreen'>;

export const QuizScreen: React.FC<QuizScreenProps> = ({ navigation, route }) => {
  const { userId, categoryId, difficulty, category } = route.params;
  const { user, refreshUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Configure status bar
    configureStatusBar();

    // Initialize sound manager
    SoundManager.init();

    // Load user data when component mounts
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        if (userId) {
          await refreshUser(userId);
        }
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load user data');
        setIsLoading(false);
      }
    };

    loadUserData();

    return () => {
      // Clean up if needed
    };
  }, [userId, refreshUser]);

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    SoundManager.playInteraction();
    // Display score and navigate back
    Alert.alert(
      'Quiz Completed!',
      `Your score: ${score}/${totalQuestions}`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handleOpenSettings = () => {
    SoundManager.playInteraction();
    navigation.navigate('Settings', { userId: userId });
  };

  const handleLogout = () => {
    SoundManager.playInteraction();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleRetry = () => {
    setError(null);
    refreshUser(userId);
  };

  const handleBackPress = () => {
    SoundManager.playInteraction();
    Alert.alert(
      'End Quiz?',
      'Are you sure you want to end this quiz? Your progress will be lost and no XP will be gained.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Quiz',
          style: 'destructive',
          onPress: () => navigation.navigate('Quiz', { userId, category }),
        },
      ]
    );
  };

  // Calculate some example XP for visual demonstration
  const userXpCurrent = user?.xp || 50;
  const userXpRequired = (user?.level || 1) * 100;

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading quiz...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.quizContainer}>
        <Quiz
          categoryId={categoryId}
          difficulty={difficulty}
          onComplete={handleQuizComplete}
        />
      </View>
    );
  };

  // Make sure we have a valid user before rendering the UserHeader
  const renderUserHeader = () => {
    return (
      <UserHeader
        username={user?.name}
        xpCurrent={userXpCurrent}
        xpRequired={userXpRequired}
        onSettingsPress={handleOpenSettings}
        onLogoutPress={handleLogout}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <View style={styles.headerContainer}>
        {renderUserHeader()}
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackPress}
      >
        <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        <Text style={styles.backButtonText}>End Quiz</Text>
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </View>
  );
};

export default QuizScreen;

