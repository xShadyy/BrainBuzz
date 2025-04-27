import {StyleSheet, Dimensions} from 'react-native';

const {height } = Dimensions.get('window');

// Helper for responsive sizing
const responsiveSize = (size: number) => {
  return Math.round((size / 812) * height); // 812 is base height for iPhone X
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveSize(16),
  },
  questionCount: {
    fontSize: responsiveSize(16),
    fontFamily: 'Lexend-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: responsiveSize(10),
    textAlign: 'center',
  },
  questionText: {
    fontSize: responsiveSize(22),
    fontFamily: 'Lexend-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: responsiveSize(30),
    lineHeight: responsiveSize(30),
  },
  answersContainer: {
    width: '100%',
    maxWidth: responsiveSize(400),
    alignSelf: 'center',
    marginTop: responsiveSize(10),
  },
  answerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: responsiveSize(16),
    paddingHorizontal: responsiveSize(20),
    borderRadius: responsiveSize(10),
    marginBottom: responsiveSize(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  answerText: {
    fontSize: responsiveSize(16),
    fontFamily: 'Lexend-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  correctAnswer: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderColor: '#4CAF50',
    transform: [{scale: 1.02}],
    shadowColor: '#4CAF50',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: responsiveSize(10),
    elevation: 6,
  },
  wrongAnswer: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    borderColor: '#F44336',
    transform: [{scale: 1.02}],
    shadowColor: '#F44336',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: responsiveSize(10),
    elevation: 6,
  },
  feedbackContainer: {
    padding: responsiveSize(16),
    borderRadius: responsiveSize(10),
    marginTop: responsiveSize(20),
    alignItems: 'center',
  },
  correctText: {
    fontSize: responsiveSize(24),
    fontFamily: 'Lexend-Bold',
    color: '#4CAF50',
    textShadowColor: 'rgba(76, 175, 80, 0.5)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: responsiveSize(10),
  },
  wrongText: {
    fontSize: responsiveSize(24),
    fontFamily: 'Lexend-Bold',
    color: '#F44336',
    textShadowColor: 'rgba(244, 67, 54, 0.5)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: responsiveSize(10),
  },
  errorText: {
    fontSize: responsiveSize(16),
    fontFamily: 'Lexend-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
    padding: responsiveSize(20),
  },
  progressBar: {
    width: '100%',
    height: responsiveSize(6),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: responsiveSize(3),
    marginTop: responsiveSize(10),
    marginBottom: responsiveSize(20),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7B53C1',
    borderRadius: responsiveSize(3),
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveSize(10),
  },
  scoreText: {
    fontSize: responsiveSize(16),
    fontFamily: 'Lexend-SemiBold',
    color: '#FFFFFF',
    marginRight: responsiveSize(5),
  },
  scoreValue: {
    fontSize: responsiveSize(16),
    fontFamily: 'Lexend-Bold',
    color: '#7B53C1',
  },
});
