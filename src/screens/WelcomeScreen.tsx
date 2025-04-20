/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { View, LogBox, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import TexturedText from '../components/TexturedText';
import GradientText from '../components/GradientText';
import { styles } from './WelcomeScreen.styles';
import SoundManager from '../utils/SoundManager';

LogBox.ignoreLogs(['ViewPropTypes will be removed']);

interface WelcomeScreenProps {
  onFinish?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish }) => {
  const [showLightning, setShowLightning] = useState(false);
  const [showText, setShowText] = useState(false);
  const lightningRef = useRef<LottieView>(null);
  const textOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    SoundManager.init();

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => SoundManager.playZap(), 800));
    timers.push(setTimeout(() => setShowLightning(true), 1000));
    timers.push(
      setTimeout(() => {
        lightningRef.current?.play();


        timers.push(
          setTimeout(() => {
            SoundManager.playSecondZap();
          }, 1000)
        );
      }, 1100)
    );
    timers.push(setTimeout(() => setShowText(true), 1200));
    timers.push(
      setTimeout(() => {
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => {
            onFinish?.();
          }, 1000);
        });
      }, 4000)
    );

    return () => {
      timers.forEach(clearTimeout);
      SoundManager.release();
    };
  }, [onFinish, textOpacity]);

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
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        >
          <LottieView
            ref={lightningRef}
            source={require('../assets/animations/lightning.json')}
            autoPlay={false}
            loop={false}
            style={{ width: '100%', height: '100%' }}
            speed={1.5}
            onAnimationFinish={() => setShowLightning(false)}
          />
        </View>
      )}

      {showText && (
        <Animated.View style={[styles.textContainer, { zIndex: 2, opacity: textOpacity }]}>
          <View style={styles.titleContainer}>
            <View style={styles.brainTextContainer}>
              <TexturedText
                text="BRAIN"
                textureSource={require('../assets/images/texture.jpg')}
                textStyle={styles.brainTextStyle}
              />
            </View>
            <View style={styles.buzzTextContainer}>
              <GradientText text="BUZZ" textStyle={styles.buzzTextStyle} />
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};
