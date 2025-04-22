import {StyleSheet, Platform, StatusBar} from 'react-native';

export const HEADER_HEIGHT = 120;
export const FOOTER_HEIGHT = 40;
export const ICON_SIZE = 46;
export const GRID_GAP = 15;
export const PADDING = 20;

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040414',
    paddingTop: statusBarHeight, // Add padding for status bar
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#282828',
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
  dashboardLayout: {flex: 1},
  scrollView: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    bottom: FOOTER_HEIGHT,
    left: 0,
    right: 0,
  },
  contentContainer: {padding: PADDING},
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: GRID_GAP,
  },
  gridItem: {
    width: '48%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    marginTop: 10,
    fontFamily: 'Lexend-Medium',
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    height: FOOTER_HEIGHT,
    width: '100%',
    backgroundColor: '#2B2B2B',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#FFC800',
  },
  footerText: {
    fontFamily: 'Lexend-Regular',
    fontSize: 12,
    color: '#FFFFFF',
  },
});
