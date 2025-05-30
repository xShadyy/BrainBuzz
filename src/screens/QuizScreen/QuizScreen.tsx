// QuizScreen.tsx
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {View, StatusBar, Text, Alert} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import Quiz from '../../components/Quiz';
import {UserHeader} from '../../components/UserHeader';
import {useUser} from '../../utils/UserContext';
import {db} from '../../database';
import SoundManager from '../../utils/SoundManager';
import LottieView from 'lottie-react-native';
import countdownAnimation from '../../assets/animations/countdown.json';
import {styles, configureStatusBar} from './QuizScreen.styles';

type QuizScreenProps = StackScreenProps<RootStackParamList, 'QuizScreen'>;

export const QuizScreen: React.FC<QuizScreenProps> = ({navigation, route}) => {
  const {userId, categoryId, difficulty, category} = route.params;
  const {user, refreshUser} = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdownTimeout, setCountdownTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [countdownFinished, setCountdownFinished] = useState(false);
  const hasInitializedRef = useRef(false);

  // Define loadUserData with useCallback to prevent recreation on every render
  const loadUserData = useCallback(async () => {
    if (!userId || hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;
    setIsLoading(true);
    try {
      await refreshUser(userId);
    } catch (err) {
      console.error('Error loading user data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, refreshUser]);

  // Initialize sound manager only once
  useEffect(() => {
    configureStatusBar();
    const initSound = async () => {
      await SoundManager.init();
    };
    initSound();
  }, []);

  // Load user data only once
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (countdownTimeout) {
        clearTimeout(countdownTimeout);
      }
    };
  }, [countdownTimeout]);

  // Only trigger countdown once after loading
  useEffect(() => {
    if (!isLoading && !countdownFinished) {
      setShowCountdown(true);
      SoundManager.playCountdown();
      const timer = setTimeout(() => {
        setShowCountdown(false);
        setCountdownFinished(true);
      }, 4000);
      setCountdownTimeout(timer);
      return () => clearTimeout(timer);
    }
  }, [isLoading, countdownFinished]);

  // Ensure countdown always ends (fallback)
  useEffect(() => {
    if (showCountdown && !countdownFinished) {
      const fallback = setTimeout(() => {
        setShowCountdown(false);
        setCountdownFinished(true);
      }, 5000);
      return () => clearTimeout(fallback);
    }
  }, [showCountdown, countdownFinished]);
  const handleQuizComplete = async (
    score: number,
    totalQuestions: number,
    xpEarned: number,
  ) => {
    SoundManager.playInteraction();

    try {
      // Award XP to user
      if (userId) {
        const updatedUser = await db.awardXP(userId, xpEarned);
        if (updatedUser) {
          // Refresh user context with updated data
          await refreshUser(userId);
        }
      }

      // XP display is now handled in the Quiz component's results screen
      // No need for Android alert anymore
    } catch (error) {
      console.error('Error awarding XP:', error);
      Alert.alert('Error', 'Failed to save your progress. Please try again.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    }
  };

  const handleEndQuiz = () => {
    SoundManager.playInteraction();
    navigation.navigate('Dashboard', {userId});
  };

  const handleOpenSettings = () => {
    SoundManager.playInteraction();
    navigation.navigate('Settings', {userId});
  };

  const handleLogout = () => {
    SoundManager.playInteraction();
    navigation.reset({index: 0, routes: [{name: 'Login'}]});
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading quiz...</Text>
        </View>
      );
    }
    return (
      <View style={styles.quizContainer}>
        <Quiz
          categoryId={categoryId}
          difficulty={difficulty}
          category={category}
          onComplete={handleQuizComplete}
          onEndQuiz={handleEndQuiz}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      {showCountdown && (
        <LottieView
          source={countdownAnimation}
          autoPlay
          loop={false}
          onAnimationFinish={() => {
            setShowCountdown(false);
            setCountdownFinished(true);
          }}
          style={styles.countdownAnimation}
          resizeMode="cover"
        />
      )}
      <View style={styles.headerContainer}>
        <UserHeader
          username={user?.name}
          onSettingsPress={handleOpenSettings}
          onLogoutPress={handleLogout}
        />
      </View>
      <View style={styles.contentContainer}>
        {!showCountdown && renderContent()}
      </View>
    </View>
  );
};
