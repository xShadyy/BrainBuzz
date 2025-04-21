import { StyleSheet, Dimensions } from 'react-native';

// Get the full screen dimensions including status bar area
const { width, height } = Dimensions.get('screen');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  backgroundContainer: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: '#E8EFF5', // Pale blue/gray color
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8EFF5',
  },
  loadingAnimation: {
    width: 150,
    height: 150,
  },
  loadingText: {
    marginTop: 20,
    color: '#3A4A5D',
    fontFamily: 'Lexend-Medium',
    fontSize: 16,
    textAlign: 'center',
  },
  // Updated dashboard layout without side menu
  dashboardLayout: {
    flex: 1,
    flexDirection: 'column',
    zIndex: 2,
    height: '100%',
  },
  // Main content container, now takes full width
  mainContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
  // Showing content now
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  dashboardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Lexend-Bold',
    color: '#3A4A5D',
    marginBottom: 12,
  },
  sectionContent: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#8897A8',
    fontFamily: 'Lexend-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    color: '#8897A8',
    fontFamily: 'Lexend-Regular',
    fontSize: 12,
  },
});
