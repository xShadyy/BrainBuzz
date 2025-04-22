import { StyleSheet, StatusBar, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0A0A6E',
    // Position at the top of the screen
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    // Calculate padding based on platform
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
    paddingBottom: 10,
    elevation: 4, // Android elevation for shadow
    shadowColor: '#000', // iOS shadow properties
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  userInfoContainer: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontFamily: 'Supercharge-JRgPo',
    color: '#FFFFFF',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  levelBadge: {
    backgroundColor: '#FF5722',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#FFEB74',
  },
  levelText: {
    color: '#FFFFFF',
    fontFamily: 'Lexend-Medium',
    fontSize: 14,
    textAlign: 'center',
  },
  xpContainer: {
    flex: 1,
  },
  xpBarBackground: {
    backgroundColor: 'rgba(12, 12, 12, 0.3)',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    backgroundColor: '#FFEB74',
    height: '100%',
    borderRadius: 4,
  },
  xpText: {
    color: '#FFFFFF',
    fontFamily: 'Lexend-Medium',
    fontSize: 12,
    marginTop: 2,
    opacity: 0.9,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconStyle: {
    color: '#FFFFFF',
  },
});

// Export a function to set status bar color
export const configureStatusBar = () => {
  StatusBar.setBackgroundColor('#0A0A6E');
  StatusBar.setBarStyle('light-content');

  // For iOS, we need to ensure the app has a translucent status bar
  if (Platform.OS === 'ios') {
    StatusBar.setTranslucent(true);
  }
};
