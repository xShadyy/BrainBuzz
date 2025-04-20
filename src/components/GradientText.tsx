import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

interface GradientTextProps {
  text: string;
  style?: any;
  textStyle?: any;
  colors?: string[];
}

const GradientText: React.FC<GradientTextProps> = ({
  text,
  style,
  textStyle,
  colors = ['#FFFFFF', '#E0E0E0', '#FFFFFF'],
}) => {
  return (
    <View style={[styles.container, style]}>
      <MaskedView
        style={styles.maskedView}
        maskElement={
          <Text style={[styles.text, textStyle]}>
            {text}
          </Text>
        }>
        <LinearGradient
          colors={colors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradient}
        />
      </MaskedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  maskedView: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 48,
    textAlign: 'center',
    lineHeight: 60,
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default GradientText;
