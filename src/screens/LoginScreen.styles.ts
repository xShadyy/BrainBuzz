import {StyleSheet, Dimensions} from 'react-native';

// Get the full screen dimensions including status bar area
const {width, height} = Dimensions.get('screen');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Fallback background color
    width: width,
    height: height,
    // Ensure content extends to the top of the screen
    paddingTop: 0,
    marginTop: 0,
  },
  backgroundAnimation: {
    position: 'absolute',
    width: width,
    height: height, // Full height of device including status bar
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Ensure background is behind content
    backgroundColor: '#0A0A6E', // Match the final color of the transition animation
  },
  keyboardAvoidView: {
    flex: 1,
    zIndex: 2, // Above animation
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // Remove paddingTop that may create a gap at the top
    paddingTop: 20,
  },
  formContainer: {
    width: width * 0.85,
    backgroundColor: 'rgba(10, 10, 40, 0.70)', // Semi-transparent to show animation behind
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(167, 167, 255, 0.3)', // Light blue border color to match transition
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 28,
    fontFamily: 'Lexend-Bold',
    color: '#FFFFFF',
    textShadowColor: '#2A2ACC', // Blue from transition animation
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 15,
    letterSpacing: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Lexend-Medium',
    fontSize: 14,
    color: '#F0F0FF', // Slight blue tint to match theme
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontFamily: 'Lexend-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 201, 242, 0.25)', // Pink tint from animation
  },
  buttonContainer: {
    backgroundColor: 'rgba(42, 42, 204, 0.25)', // Blue from transition
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 201, 242, 0.5)', // Pink tint from animation
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Lexend-SemiBold',
    fontSize: 18,
    textShadowColor: '#FFD3F4', // Pink from animation
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
  switchModeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchModeText: {
    color: '#FFD3F4', // Pink from animation
    fontFamily: 'Lexend-Medium',
    fontSize: 14,
    textShadowColor: '#A7A7FF', // Light blue from animation
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 5,
  },
  errorText: {
    color: '#FF6666',
    fontFamily: 'Lexend-Medium',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: '#FF0000',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 5,
  },
  // Success Animation Modal styles
  successAnimationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 10, 60, 0.9)', // Semi-transparent dark blue background
  },
  successAnimationWrapper: {
    width: width * 0.5, // Make the wrapper smaller (50% of screen width)
    height: width * 0.5, // Keep it square
    justifyContent: 'center',
    alignItems: 'center',
  },
  successAnimation: {
    width: '100%',
    height: '100%',
  },
});
