import {StyleSheet, StatusBar, Dimensions} from 'react-native';

const { height} = Dimensions.get('window');

// Helper for responsive sizing
const responsiveSize = (size: number) => {
  return Math.round((size / 812) * height); // 812 is base height for iPhone X
};

// Get the status bar height for Android
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0;
// Estimate the header height (status bar + content)
const HEADER_HEIGHT = STATUS_BAR_HEIGHT + responsiveSize(115); // Adjust this value based on your header

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
    marginTop: HEADER_HEIGHT, // Add margin to account for absolute header
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Center content vertically in remaining space
  },
  centeringContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: responsiveSize(16),
    paddingTop: responsiveSize(20), // Add some space at the top
  },
  contentSpacer: {
    height: responsiveSize(80),
  },
  categoryText: {
    fontSize: responsiveSize(24),
    fontFamily: 'Lexend-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: responsiveSize(10),
  },
  backToCategoriesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: responsiveSize(10),
    paddingHorizontal: responsiveSize(15),
    borderRadius: responsiveSize(8),
    marginBottom: responsiveSize(20),
    alignSelf: 'center',
  },
  backToCategoriesText: {
    color: '#FFFFFF',
    fontFamily: 'Lexend-Medium',
    fontSize: responsiveSize(14),
    marginLeft: responsiveSize(8),
  },
  chooseText: {
    fontSize: responsiveSize(16),
    fontFamily: 'Lexend-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: responsiveSize(10),
    marginBottom: responsiveSize(20),
  },
  difficultiesContainer: {
    paddingVertical: responsiveSize(16),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  difficultyButton: {
    borderRadius: responsiveSize(8),
    padding: responsiveSize(20),
    marginBottom: responsiveSize(24),
    elevation: 8,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveSize(30),
  },
  selectedDifficultyButton: {
    shadowOpacity: 1,
    shadowRadius: responsiveSize(20),
    elevation: 15,
    transform: [{scale: 1.05}],
  },
  difficultyIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyIcon: {
    marginRight: responsiveSize(15),
  },
  difficultyText: {
    fontSize: responsiveSize(18),
    fontFamily: 'Lexend-SemiBold',
    color: '#FFFFFF',
  },
  multiplierContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: responsiveSize(12),
    paddingVertical: responsiveSize(6),
    borderRadius: responsiveSize(15),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  multiplierText: {
    color: '#FFFFFF',
    fontFamily: 'Lexend-Bold',
    fontSize: responsiveSize(16),
  },
  // Dynamic difficulty button styles remain the same as they use color values
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
