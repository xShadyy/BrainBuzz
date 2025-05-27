import { StyleSheet, StatusBar } from 'react-native';

export const configureStatusBar = () => {
  // light-content works best on black
  StatusBar.setBarStyle('light-content');
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor('transparent');
};

export const styles = StyleSheet.create({
  // Root container
  container: {
    flex: 1,
    backgroundColor: '#1D1D1D',    // ← pure black
  },

  // Header
  headerContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  // Main content area
  contentContainer: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  // Quiz wrapper
  quizContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    // ensure a stable height so children don’t push things around:
    minHeight: 400,
    justifyContent: 'space-between',
  },

  // Question text
  questionText: {
    fontSize: 20,
    fontFamily: 'Lexend-Medium',
    color: '#FFFFFF',             // ← white text
    textAlign: 'center',
    marginBottom: 20,
  },

  // Answer list
  answerList: {
    width: '100%',
  },

  // Each answer button
  answerButton: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginBottom: 12,
    alignItems: 'center',
  },
  answerButtonText: {
    fontSize: 16,
    fontFamily: 'Lexend-Medium',
    color: '#FFFFFF',
  },

  // Feedback (e.g. “Correct!”) pinned at bottom center
  feedbackContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 18,
    fontFamily: 'Lexend-SemiBold',
    color: '#FFFFFF',
  },

  // Loading and error states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontFamily: 'Lexend-Medium',
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginBottom: 16,
    fontSize: 18,
    fontFamily: 'Lexend-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: '#000000',
  },
  countdownAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
});
