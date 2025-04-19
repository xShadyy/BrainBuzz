import React, {useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen = ({onFinish}: SplashScreenProps) => {
  const logoOpacity = useMemo(() => new Animated.Value(0), []);
  const logoScale = useMemo(() => new Animated.Value(0.95), []);
  const backgroundOpacity = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    // Start animations
    Animated.sequence([
      // Fade in background
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      // Fade in and scale up logo
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
      // Hold for a moment
      Animated.delay(800),
      // Fade out everything
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundOpacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onFinish();
    });
  }, [backgroundOpacity, logoOpacity, logoScale, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.background,
          {
            opacity: backgroundOpacity,
          },
        ]}>
        <View style={styles.gradientOverlay} />
      </Animated.View>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{scale: logoScale}],
          },
        ]}>
        <Text style={styles.logoText}>BRAINBUZZ</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#007AFF',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
  },
});
