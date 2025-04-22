/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { View, LogBox, Animated, Text, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { styles } from './WelcomeScreen.styles';
import SoundManager from '../utils/SoundManager';

LogBox.ignoreLogs(['ViewPropTypes will be removed']);

interface WelcomeScreenProps {
  onFinish?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish }) => {
  const [showLightning, setShowLightning] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [frozen] = useState(true);
  const lightningRef = useRef<LottieView>(null);
  const textOpacity = useRef(new Animated.Value(0)).current;
  const enterButtonOpacity = useRef(new Animated.Value(0)).current;
  const enterButtonScale = useRef(new Animated.Value(0.8)).current;
  const enterButtonTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {


    SoundManager.init();

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setShowLightning(true), 1000));
    timers.push(
      setTimeout(() => {
        SoundManager.playZap1();
        lightningRef.current?.play();
      }, 1100)
    );
    timers.push(setTimeout(() => {
      setShowText(true);
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    }, 1200));

    timers.push(setTimeout(() => {
      SoundManager.playZap2();
    }, 2200));

    timers.push(setTimeout(() => {
      setShowEnterButton(true);
      Animated.parallel([
        Animated.timing(enterButtonOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(enterButtonScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(enterButtonTranslate, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1200 + 1500 + 2000));

    if (!frozen) {
      timers.push(
        setTimeout(() => {
          Animated.timing(textOpacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }).start(() => {
            if (onFinish) {
              onFinish();
            }
          });
        }, 4000)
      );
    }

    return () => {
      timers.forEach(clearTimeout);
      SoundManager.release();
    };
  }, [onFinish, textOpacity, frozen, enterButtonOpacity, enterButtonScale, enterButtonTranslate]);

  const handleEnterPress = () => {
    SoundManager.playInteraction();
    // Removed fadeOutAmbient call

    Animated.sequence([
      Animated.timing(enterButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(enterButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(enterButtonOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(enterButtonTranslate, {
          toValue: 20,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      if (onFinish) {
        onFinish();
      }
    });
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animations/background.json')}
        autoPlay
        loop
        style={styles.backgroundAnimation}
        resizeMode="cover"
      />

      {showLightning && (
        <View style={styles.lightningContainer}>
          <LottieView
            ref={lightningRef}
            source={require('../assets/animations/lightning.json')}
            autoPlay={false}
            loop={false}
            style={styles.lightningAnimation}
            speed={1.5}
            onAnimationFinish={() => setShowLightning(false)}
          />
        </View>
      )}

      {showText && (
        <Animated.View
          style={[
            styles.textContainer,
            {
              zIndex: 2,
              opacity: textOpacity,
            },
          ]}
        >
          <View style={styles.titleContainer}>
            <Text style={[styles.brainTextStyle, { color: '#FFEB74' }]}>BRAIN</Text>
            <Text style={[styles.buzzTextStyle, { color: '#FFFFFF' }]}>BUZZ</Text>
          </View>
        </Animated.View>
      )}

      {showEnterButton && (
        <Animated.View
          style={[
            styles.enterButtonContainer,
            {
              opacity: enterButtonOpacity,
              transform: [
                { scale: enterButtonScale },
                { translateY: enterButtonTranslate },
              ],
            },
          ]}
        >
          <View style={styles.cornerTL} />
          <TouchableOpacity
            onPress={handleEnterPress}
            style={styles.enterButton}
            activeOpacity={0.8}
          >
            <Text style={styles.enterButtonText}>ENTER</Text>
          </TouchableOpacity>
          <View style={styles.cornerBR} />
        </Animated.View>
      )}
    </View>
  );
};
