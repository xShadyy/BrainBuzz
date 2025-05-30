/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
  Image,
} from 'react-native';
import LottieView from 'lottie-react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SoundManager from '../utils/SoundManager';
import {
  fetchQuestions,
  decodeQuestionData,
  ProcessedQuestion,
} from '../utils/OpenTriviaAPI';
import {useUser} from '../utils/UserContext';
import {db} from '../database';
import {styles} from './Quiz.styles';

interface Question {
  id: number;
  category_id: number;
  difficulty: string;
  text: string;
  answers: Answer[];
}

interface Answer {
  id: number;
  text: string;
  is_correct: boolean;
}

interface QuizProps {
  categoryId: number;
  difficulty: string;
  category?: string;
  onComplete?: (
    score: number,
    totalQuestions: number,
    xpEarned: number,
  ) => void;
  onEndQuiz?: () => void;
}

const Quiz: React.FC<QuizProps> = ({
  categoryId,
  difficulty,
  category,
  onComplete,
  onEndQuiz,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3); // Add lives state
  const [quizFailed, setQuizFailed] = useState(false); // Add quiz failed state
  const [error, setError] = useState<string | null>(null);
  const [progressAnim] = useState(new Animated.Value(0));
  const scoreRef = useRef(0);
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<
    'correct' | 'incorrect' | null
  >(null);
  const quizDataLoaded = useRef(false);

  // Get user data for level-based colors
  const {user} = useUser();

  // Get color for current level's progress bar (same as UserHeader)
  const getLevelColor = (level: number) => {
    const levelColors = [
      '#BD3039', // Level 1 - Eternal Storm
      '#A9B7C0', // Level 2 - Mystical Aura
      '#50CB86', // Level 3 - Jade Pyre
      '#6EEB83', // Level 4 - Emerald Inferno
      '#5DA9E9', // Level 5 - Sapphire Blaze
      '#4ECDC4', // Level 6 - Azure Flame
      '#FF5C8D', // Level 7 - Sun Flame
      '#FF6B6B', // Level 8 - Ember Spark
    ];

    // Clamp level between 1-8 and convert to array index (0-7)
    const clampedLevel = Math.max(1, Math.min(8, level));
    return levelColors[clampedLevel - 1];
  };

  const userLevel = Math.min(user?.level || 1, 8); // Cap level at 8
  useEffect(() => {
    const loadQuizData = async () => {
      if (quizDataLoaded.current) {
        return;
      }

      quizDataLoaded.current = true;

      try {
        // Convert difficulty to lowercase for API call
        const difficultyLower = difficulty.toLowerCase();

        // Fetch questions from Open Trivia DB
        const rawQuestions = await fetchQuestions(
          categoryId,
          difficultyLower,
          10,
        );

        if (rawQuestions.length === 0) {
          setError('No questions found for this category and difficulty');
          return;
        }

        // Process and decode the questions
        const processedQuestions = decodeQuestionData(rawQuestions, categoryId);
        setQuestions(processedQuestions);
      } catch (err) {
        console.error('Failed to load quiz data:', err);
        setError(
          'Failed to load quiz data. Please check your internet connection and try again.',
        );
      }
    };

    loadQuizData();
  }, [categoryId, difficulty]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    if (questions.length > 0) {
      Animated.timing(progressAnim, {
        toValue: (currentQuestionIndex + 1) / questions.length,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentQuestionIndex, questions.length, progressAnim]);
  const getCurrentQuestionAnswers = useCallback(() => {
    if (!questions.length) {
      return [];
    }
    const currentQuestion = questions[currentQuestionIndex];
    return currentQuestion.answers || [];
  }, [questions, currentQuestionIndex]);
  const handleAnswerSelect = useCallback(
    (answerId: number) => {
      if (selectedAnswerId !== null) {
        return;
      }

      const currentQuestion = questions[currentQuestionIndex];
      const selected = currentQuestion.answers.find(ans => ans.id === answerId);
      const correct = selected?.is_correct ?? false;

      if (correct) {
        SoundManager.playQuizCorrect();
      } else {
        SoundManager.playQuizIncorrect();
        // Reduce lives on wrong answer
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            // Quiz failed when no lives left
            setTimeout(() => {
              setQuizFailed(true);
            }, 1500);
          }
          return newLives;
        });
      }

      setSelectedAnswerId(answerId);
      setShowFeedback(true);
      setFeedbackType(correct ? 'correct' : 'incorrect');

      if (correct) {
        setScore(prev => {
          const updated = prev + 1;
          scoreRef.current = updated;
          return updated;
        });
      }

      const timer = setTimeout(() => {
        setShowFeedback(false);
        setFeedbackType(null);

        // Check if quiz failed (no lives left)
        if (lives <= 1 && !correct) {
          // Quiz failed, don't proceed
          return;
        }
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswerId(null);
        } else {
          // Quiz completed - calculate XP
          const finalScore = scoreRef.current;
          const difficultyLower = difficulty.toLowerCase();
          const xp = db.calculateXPReward(
            finalScore,
            questions.length,
            difficultyLower,
          );

          setFinalScore(finalScore);
          setXpEarned(xp);
          setShowResults(true);
          onComplete?.(finalScore, questions.length, xp);
        }
      }, 1500);

      return () => clearTimeout(timer);
    },
    [selectedAnswerId, questions, currentQuestionIndex, lives, onComplete],
  );

  const handleEndQuizConfirmation = useCallback(() => {
    Alert.alert(
      'End Quiz',
      'Are you sure you want to end the quiz? Your progress will be lost.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'End Quiz',
          style: 'destructive',
          onPress: onEndQuiz,
        },
      ],
      {cancelable: true},
    );
  }, [onEndQuiz]);
  const handleRetryQuiz = useCallback(() => {
    // Reset all quiz states
    setCurrentQuestionIndex(0);
    setSelectedAnswerId(null);
    setScore(0);
    setLives(3);
    setQuizFailed(false);
    setShowResults(false);
    setFinalScore(0);
    setXpEarned(0);
    setShowFeedback(false);
    setFeedbackType(null);
    scoreRef.current = 0;

    // Reset progress animation
    progressAnim.setValue(0);
  }, [progressAnim]);

  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < 3; i++) {
      hearts.push(
        <Image
          key={i}
          source={require('../assets/icons/heart.png')}
          style={[
            styles.heartIcon,
            {
              opacity: i < lives ? 1 : 0.3,
              transform: [{scale: i < lives ? 1 : 0.8}],
            },
          ]}
        />,
      );
    }
    return <View style={styles.heartsContainer}>{hearts}</View>;
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  if (!questions.length) {
    return (
      <View style={styles.container}>
        <LottieView
          source={require('../assets/animations/loader_small.json')}
          autoPlay
          loop
        />
      </View>
    );
  }

  if (quizFailed) {
    return (
      <View style={styles.container}>
        <View style={styles.quizFailedContainer}>
          <Text style={styles.quizFailedText}>Quiz Failed!</Text>
          <Text style={styles.quizFailedSubtext}>
            You ran out of lives. Better luck next time!
          </Text>
          {renderHearts()}
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetryQuiz}>
            <Text style={styles.retryButtonText}>Retry Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.endQuizButton} onPress={onEndQuiz}>
            <MaterialIcons name="arrow-back" size={18} color="#FFFFFF" />
            <Text style={styles.endQuizButtonText}>Back to Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  if (showResults) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.questionText}>Quiz Complete!</Text>
          <Text style={styles.scoreText}>
            Your Score: {finalScore} / {questions.length}
          </Text>
          <Text style={styles.scoreText}>XP Earned: +{xpEarned}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetryQuiz}>
            <Text style={styles.retryButtonText}>Retry Quiz</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.endQuizButton} onPress={onEndQuiz}>
            <Text style={styles.endQuizButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const questionAnswers = getCurrentQuestionAnswers();
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.scoreContainer}>
          <Text style={styles.categoryText}>
            Category: {category || 'Quiz'}
          </Text>
        </View>
        {renderHearts()}
        <Text style={styles.questionCount}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>{' '}
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: getLevelColor(userLevel),
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>
        <View style={styles.answersContainer}>
          {questionAnswers.map(answer => (
            <TouchableOpacity
              key={answer.id}
              style={[
                styles.answerButton,
                selectedAnswerId === answer.id &&
                  (answer.is_correct
                    ? styles.correctAnswer
                    : styles.wrongAnswer),
              ]}
              onPress={() => handleAnswerSelect(answer.id)}
              activeOpacity={0.8}>
              <Text style={styles.answerText}>{answer.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {showFeedback && feedbackType && (
          <View style={styles.feedbackAnimationOverlay} pointerEvents="none">
            <LottieView
              source={
                feedbackType === 'correct'
                  ? require('../assets/animations/correct.json')
                  : require('../assets/animations/incorrect.json')
              }
              autoPlay
              loop={false}
              style={{width: 220, height: 220}}
            />
          </View>
        )}
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.endQuizButton}
          onPress={handleEndQuizConfirmation}>
          <MaterialIcons name="arrow-back" size={18} color="#FFFFFF" />
          <Text style={styles.endQuizButtonText}>End Quiz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Quiz;
