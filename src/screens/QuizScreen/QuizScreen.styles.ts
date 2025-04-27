import {StyleSheet, StatusBar, Dimensions} from 'react-native';

const { height } = Dimensions.get('window');

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
    backgroundColor: '#130629',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: responsiveSize(20),
    marginTop: responsiveSize(10),
    alignItems: 'center',
  },
  quizContainer: {
    width: '100%',
    maxWidth: responsiveSize(600),
    alignSelf: 'center',
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    paddingTop: STATUS_BAR_HEIGHT,
    paddingBottom: responsiveSize(10),
    paddingHorizontal: responsiveSize(16),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: responsiveSize(18),
    fontFamily: 'Lexend-Medium',
    color: '#FFFFFF',
    marginTop: responsiveSize(16),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveSize(20),
  },
  errorText: {
    fontSize: responsiveSize(18),
    fontFamily: 'Lexend-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: responsiveSize(16),
  },
  retryButton: {
    backgroundColor: '#7B53C1',
    paddingHorizontal: responsiveSize(24),
    paddingVertical: responsiveSize(12),
    borderRadius: responsiveSize(8),
    elevation: 4,
    shadowColor: '#7B53C1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveSize(16),
    fontFamily: 'Lexend-SemiBold',
  },
  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(123, 83, 193, 0.5)',
    paddingVertical: responsiveSize(8),
    paddingHorizontal: responsiveSize(16),
    borderRadius: responsiveSize(20),
    position: 'absolute',
    top: HEADER_HEIGHT + responsiveSize(10),
    left: responsiveSize(16),
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveSize(14),
    fontFamily: 'Lexend-Medium',
    marginLeft: responsiveSize(6),
  },
});
