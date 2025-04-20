import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundAnimation: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -height * 0.1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0,
  },
  brainTextContainer: {
    height: 60,
    width: 180,
    justifyContent: 'center',
  },
  brainTextStyle: {
    fontSize: 48,
    fontFamily: 'Lexend-Bold',
    color: '#FFFFFF',
    textShadowColor: '#FF1493',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 40,
    textAlign: 'center',
    lineHeight: 60,
    letterSpacing: 2,
    elevation: 15,
  },
  buzzTextContainer: {
    height: 60,
    width: 150,
    justifyContent: 'center',
    marginLeft: 0,
  },
  buzzTextStyle: {
    fontSize: 48,
    fontFamily: 'Lexend-Bold',
    color: '#00FFFF',
    textShadowColor: '#FFFFFF',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 40,
    textAlign: 'center',
    lineHeight: 60,
    letterSpacing: 2,
    elevation: 15,
  },
  lightningContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  lightningAnimation: {
    width: '100%',
    height: '100%',
  },
});
