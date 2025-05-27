/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {View, Text, TouchableOpacity, Animated, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SoundManager from '../utils/SoundManager';
import {styles} from './Quiz.styles';

interface Question {
  id: number;
  category_id: number;
  difficulty: string;
  text: string;
}

interface Answer {
  id: number;
  question_id: number;
  text: string;
  is_correct: boolean;
}

interface QuizProps {
  categoryId: number;
  difficulty: string;
  onComplete?: (score: number, totalQuestions: number) => void;
  onEndQuiz?: () => void;
}

const Quiz: React.FC<QuizProps> = ({categoryId, difficulty, onComplete, onEndQuiz}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [progressAnim] = useState(new Animated.Value(0));
  const scoreRef = useRef(0);
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);
  const quizDataLoaded = useRef(false);

  useEffect(() => {
    const loadQuizData = async () => {
      if (quizDataLoaded.current) {return;}
      try {
        const questionsData = require('../../android/app/src/main/assets/quiz_data/questions.json');
        const answersData = require('../../android/app/src/main/assets/quiz_data/answers.json');

        const filteredQuestions = questionsData.filter(
          (q: Question) => q.category_id === categoryId && q.difficulty === difficulty
        );

        if (filteredQuestions.length === 0) {
          setError('No questions found for this category and difficulty');
          return;
        }

        console.log(`[Quiz] Loaded ${filteredQuestions.length} questions for category ${categoryId}, difficulty ${difficulty}`);
        quizDataLoaded.current = true;
        setQuestions(filteredQuestions);
        setAnswers(answersData);
      } catch (err) {
        console.error('Failed to load quiz data:', err);
        setError('Failed to load quiz data. Please try again later.');
      }
    };
    loadQuizData();
  }, [categoryId, difficulty]); // Only run once on mount

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
    if (questions.length === 0 || answers.length === 0) {
      return [];
    }
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
      console.error(`[Quiz] No question found at index ${currentQuestionIndex}`);
      return [];
    }
    const questionAnswers = answers.filter(ans => ans.question_id === currentQuestion.id);
    console.log(`[Quiz] Found ${questionAnswers.length} answers for question ${currentQuestion.id}`);
    return questionAnswers;
  }, [questions, answers, currentQuestionIndex]);

  const handleAnswerSelect = useCallback((answerId: number) => {
    if (selectedAnswerId !== null) {return;}

    // Play sound immediately before any state changes or animation
    const selected = answers.find(ans => ans.id === answerId);
    const correct = selected?.is_correct ?? false;

    if (correct) {
      SoundManager.playQuizCorrect();
    } else {
      SoundManager.playQuizIncorrect();
    }

    setSelectedAnswerId(answerId);
    setIsCorrect(correct);
    setShowFeedback(true);
    setFeedbackType(correct ? 'correct' : 'incorrect');

    if (correct) {
      setScore(prev => {
        const updated = prev + 1;
        scoreRef.current = updated;
        return updated;
      });
    }

    // Use setTimeout to delay moving to the next question
    const timer = setTimeout(() => {
      setShowFeedback(false);
      setFeedbackType(null);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedAnswerId(null);
        setIsCorrect(null);
        console.log(`[Quiz] Moving to question ${currentQuestionIndex + 1}`);
      } else {
        setFinalScore(scoreRef.current);
        setShowResults(true);
        if (onComplete) {onComplete(scoreRef.current, questions.length);}
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [selectedAnswerId, answers, currentQuestionIndex, questions.length, onComplete]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <LottieView source={require('../assets/animations/loader_small.json')} autoPlay loop />
      </View>
    );
  }

  if (showResults) {
    return (
      <View style={styles.container}>
        <Text style={styles.questionText}>Quiz Complete!</Text>
        <Text style={styles.scoreText}>Your Score: {finalScore} / {questions.length}</Text>
        <TouchableOpacity style={styles.endQuizButton} onPress={onEndQuiz}>
          <Text style={styles.endQuizButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const questionAnswers = getCurrentQuestionAnswers();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.endQuizButton} onPress={onEndQuiz}>
        <MaterialIcons name="arrow-back" size={18} color="#FFFFFF" />
        <Text style={styles.endQuizButtonText}>End Quiz</Text>
      </TouchableOpacity>

      <Text style={styles.questionCount}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </Text>

      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
          ]}
        />
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score:</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>

      <Text style={styles.questionText}>{currentQuestion.text}</Text>

      <View style={styles.answersContainer}>
        {questionAnswers.map(answer => (
          <TouchableOpacity
            key={answer.id}
            style={[
              styles.answerButton,
              selectedAnswerId === answer.id &&
                (answer.is_correct ? styles.correctAnswer : styles.wrongAnswer),
            ]}
            onPress={() => handleAnswerSelect(answer.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.answerText}>{answer.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Feedback Animation Overlay */}
      {showFeedback && feedbackType && (
        <View style={[StyleSheet.absoluteFill, {zIndex: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.25)'}]} pointerEvents="none">
          <LottieView
            source={
              feedbackType === 'correct'
                ? require('../assets/animations/correct.json')
                : require('../assets/animations/incorrect.json')
            }
            autoPlay
            loop={false}
            style={{ width: 220, height: 220, alignSelf: 'center' }}
            resizeMode="cover"
          />
        </View>
      )}
    </View>
  );
};

export default Quiz;
