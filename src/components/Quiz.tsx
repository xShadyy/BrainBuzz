import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { styles } from './Quiz.styles.ts';

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
}

const Quiz: React.FC<QuizProps> = ({ categoryId, difficulty, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        console.log('Loading quiz data for category:', categoryId, 'difficulty:', difficulty);

        // Load questions and answers from JSON files
        const questionsData = require('../../android/app/src/main/assets/quiz_data/questions.json');
        const answersData = require('../../android/app/src/main/assets/quiz_data/answers.json');

        console.log('Questions loaded:', questionsData.length);
        console.log('Answers loaded:', answersData.length);

        // Filter questions by category and difficulty
        const filteredQuestions = questionsData.filter(
          (q: Question) => q.category_id === categoryId && q.difficulty === difficulty
        );

        console.log('Filtered questions:', filteredQuestions.length);

        if (filteredQuestions.length === 0) {
          setError(`No questions found for category ID ${categoryId} with difficulty ${difficulty}`);
        }

        setQuestions(filteredQuestions);
        setAnswers(answersData);
      } catch (err) {
        console.error('Error loading quiz data:', err);
        setError('Failed to load quiz data. Please try again later.');
      }
    };

    loadQuizData();
  }, [categoryId, difficulty]);

  // Update progress bar when question changes
  useEffect(() => {
    if (questions.length > 0) {
      Animated.timing(progressAnim, {
        toValue: (currentQuestionIndex + 1) / questions.length,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentQuestionIndex, questions.length, progressAnim]);

  // Get answers for the current question
  const getCurrentQuestionAnswers = (): Answer[] => {
    if (!questions || questions.length === 0 || !answers || answers.length === 0) {
      return [];
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
      return [];
    }

    const questionAnswers = answers.filter(answer => answer.question_id === currentQuestion.id);
    console.log('Answers for question:', currentQuestion.id, 'count:', questionAnswers.length);
    return questionAnswers;
  };

  const handleAnswerSelect = (answerId: number) => {
    setSelectedAnswerId(answerId);

    const selectedAnswer = answers.find(answer => answer.id === answerId);
    const correct = selectedAnswer?.is_correct || false;

    setIsCorrect(correct);

    if (correct) {
      setScore(prevScore => prevScore + 1);
    }

    // Move to the next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedAnswerId(null);
        setIsCorrect(null);
      } else {
        // Quiz is complete
        if (onComplete) {
          onComplete(score + (correct ? 1 : 0), questions.length);
        }
      }
    }, 1500);
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No questions found for this category and difficulty.</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Question not found.</Text>
      </View>
    );
  }

  const questionAnswers = getCurrentQuestionAnswers();

  return (
    <View style={styles.container}>
      <Text style={styles.questionCount}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <Animated.View
          style={[styles.progressFill, { width: progressAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }) }]}
        />
      </View>

      {/* Score Display */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score:</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>

      <Text style={styles.questionText}>{currentQuestion.text}</Text>

      <View style={styles.answersContainer}>
        {questionAnswers && questionAnswers.length > 0 ? (
          questionAnswers.map((answer) => (
            <TouchableOpacity
              key={answer.id}
              style={[
                styles.answerButton,
                selectedAnswerId === answer.id &&
                  (answer.is_correct ? styles.correctAnswer : styles.wrongAnswer),
              ]}
              onPress={() => handleAnswerSelect(answer.id)}
              disabled={selectedAnswerId !== null}
            >
              <Text style={styles.answerText}>{answer.text}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.errorText}>No answers available for this question.</Text>
        )}
      </View>

      {isCorrect !== null && (
        <View style={styles.feedbackContainer}>
          <Text style={isCorrect ? styles.correctText : styles.wrongText}>
            {isCorrect ? 'Correct!' : 'Wrong!'}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Quiz;
