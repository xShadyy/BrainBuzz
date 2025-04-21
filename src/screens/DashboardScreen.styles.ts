import { StyleSheet, Dimensions, StatusBar } from 'react-native';

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
  header: {
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight || 20,
    paddingBottom: 15,
    backgroundColor: '#D0DEF0',
    borderBottomWidth: 1,
    borderBottomColor: '#B8C9DF',
  },
  welcomeText: {
    color: '#3A4A5D',
    fontFamily: 'Lexend-Bold',
    fontSize: 20,
  },
  logoutButton: {
    backgroundColor: '#B8C9DF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A0B5D0',
  },
  logoutText: {
    color: '#3A4A5D',
    fontFamily: 'Lexend-Medium',
    fontSize: 14,
  },
  scrollView: {
    zIndex: 2,
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  dashboardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#D0DEF0',
  },
  sectionTitle: {
    color: '#3A4A5D',
    fontFamily: 'Lexend-SemiBold',
    fontSize: 18,
    marginBottom: 15,
  },
  sectionContent: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#8696A7',
    fontFamily: 'Lexend-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    zIndex: 2,
    padding: 15,
    backgroundColor: '#D0DEF0',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#B8C9DF',
  },
  footerText: {
    color: '#8696A7',
    fontFamily: 'Lexend-Regular',
    fontSize: 12,
  },
});
