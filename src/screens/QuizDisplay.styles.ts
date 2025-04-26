import {StyleSheet, StatusBar} from 'react-native';

// Configure status bar to match app theme
export const configureStatusBar = () => {
  StatusBar.setBarStyle('light-content');
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor('transparent');
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  categoryTitle: {
    fontSize: 24,
    fontFamily: 'Lexend-Bold',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  instructionsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: 'Lexend-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  difficultiesContainer: {
    paddingVertical: 16,
  },
  difficultyButton: {
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
  },
  selectedDifficulty: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  difficultyText: {
    fontSize: 18,
    fontFamily: 'Lexend-SemiBold',
    color: '#FFFFFF',
  },
  // Quiz question styles
  questionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
  },
  questionText: {
    fontSize: 18,
    fontFamily: 'Lexend-Medium',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  answerOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedAnswer: {
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
    borderColor: '#2196F3',
    borderWidth: 1,
  },
  correctAnswer: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  incorrectAnswer: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    borderColor: '#F44336',
    borderWidth: 1,
  },
  answerText: {
    fontSize: 16,
    fontFamily: 'Lexend-Regular',
    color: '#FFFFFF',
    flex: 1,
  },
});
