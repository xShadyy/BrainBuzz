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
  categoryText: {
    fontSize: 24,
    fontFamily: 'Lexend-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  backToCategoriesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'center',
  },
  backToCategoriesText: {
    color: '#FFFFFF',
    fontFamily: 'Lexend-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  chooseText: {
    fontSize: 16,
    fontFamily: 'Lexend-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  difficultiesContainer: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  difficultyButton: {
    borderRadius: 8,
    padding: 20,
    marginBottom: 24,
    elevation: 8,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  selectedDifficultyButton: {
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
    transform: [{scale: 1.05}],
  },
  difficultyIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyIcon: {
    marginRight: 15,
  },
  difficultyText: {
    fontSize: 18,
    fontFamily: 'Lexend-SemiBold',
    color: '#FFFFFF',
  },
  multiplierContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  multiplierText: {
    color: '#FFFFFF',
    fontFamily: 'Lexend-Bold',
    fontSize: 16,
  },
  // Dynamic difficulty button styles
  easyButton: {
    backgroundColor: '#4CAF50',
    shadowColor: 'rgba(76, 175, 80, 0.7)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  mediumButton: {
    backgroundColor: '#FF9800',
    shadowColor: 'rgba(255, 152, 0, 0.7)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  hardButton: {
    backgroundColor: '#F44336',
    shadowColor: 'rgba(244, 67, 54, 0.7)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});
