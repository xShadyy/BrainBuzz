/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  LogBox,
  Animated,
  Text,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {styles} from './WelcomeScreen.styles';
import SoundManager from '../utils/SoundManager';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

LogBox.ignoreLogs(['ViewPropTypes will be removed']);

type WelcomeScreenProps = StackScreenProps<RootStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const [showLightning, setShowLightning] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [frozen] = useState(true);
  const lightningRef = useRef<LottieView>(null);
  const textOpacity = useRef(new Animated.Value(0)).current;
  const enterButtonOpacity = useRef(new Animated.Value(0)).current;
  const enterButtonScale = useRef(new Animated.Value(0.8)).current;
  const enterButtonTranslate = useRef(new Animated.Value(20)).current;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // No need to set status bar here anymore since it's handled at app level

    const initializeApp = async () => {
      try {
        await SoundManager.init();
        SoundManager.playAmbient();

        timers.current.push(setTimeout(() => setShowLightning(true), 1000));
        timers.current.push(
          setTimeout(() => {
            SoundManager.playZap1();
            lightningRef.current?.play();
          }, 1100),
        );
        timers.current.push(
          setTimeout(() => {
            setShowText(true);
            Animated.timing(textOpacity, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }).start();
          }, 1200),
        );

        timers.current.push(
          setTimeout(() => {
            SoundManager.playZap2();
          }, 2200),
        );

        timers.current.push(
          setTimeout(() => {
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
          }, 2900),
        ); // 1200 + 1500 + 200 = 2900ms
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeApp();

    return () => {
      // Only clear timers, no status bar reset needed
      timers.current.forEach(clearTimeout);
    };
  }, [
    textOpacity,
    frozen,
    enterButtonOpacity,
    enterButtonScale,
    enterButtonTranslate,
  ]);

  const handleEnterPress = () => {
    SoundManager.playInteraction();

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
    ]).start(() => navigation.replace('Login'));
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
          ]}>
          <Text style={styles.titleContainer}>
            <Text style={{color: '#FFEB74', fontFamily: 'Supercharge-JRgPo'}}>
              BRAIN
            </Text>
            <Text style={{color: '#FFFFFF', fontFamily: 'Supercharge-JRgPo'}}>
              BUZZ
            </Text>
            <Text
              style={{color: 'transparent', fontFamily: 'Supercharge-JRgPo'}}>
              _
            </Text>
          </Text>
        </Animated.View>
      )}

      {showEnterButton && (
        <Animated.View
          style={[
            styles.enterButtonContainer,
            {
              opacity: enterButtonOpacity,
              transform: [
                {scale: enterButtonScale},
                {translateY: enterButtonTranslate},
              ],
            },
          ]}>
          <View style={styles.cornerTL} />
          <TouchableOpacity
            onPress={handleEnterPress}
            style={styles.enterButton}
            activeOpacity={0.8}>
            <Text style={styles.enterButtonText}>ENTER</Text>
          </TouchableOpacity>
          <View style={styles.cornerBR} />
        </Animated.View>
      )}
    </View>
  );
};
