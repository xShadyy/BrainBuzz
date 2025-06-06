import {StyleSheet, StatusBar, Platform} from 'react-native';

const STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(43, 43, 43)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: STATUS_BAR_HEIGHT,
    paddingBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(255, 200, 0)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  userInfoContainer: {
    flex: 1,
  },
  usernameContainer: {
    flex: 1,
    marginRight: 10,
  },
  username: {
    fontSize: 25,
    fontFamily: 'Supercharge-JRgPo',
    color: '#FFC800',
    marginBottom: 4,
    textTransform: 'uppercase',
    flexShrink: 1,
    textShadowColor: 'rgba(255, 200, 0, 0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  levelEffect: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    position: 'relative',
    top: -15,
  },
  xpContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 10,
    paddingBottom: 5,
  },
  xpBarBackground: {
    backgroundColor: 'rgba(12, 12, 12, 0.61)',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
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
    minWidth: 64,
  },
});

export const configureStatusBar = () => {
  StatusBar.setBackgroundColor('rgb(43, 43, 43)');
  StatusBar.setBarStyle('light-content');
};
