import React from 'react';
import {Text, StyleSheet, View, Image, ImageSourcePropType} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';

interface TexturedTextProps {
  text: string;
  textureSource: ImageSourcePropType;
  style?: any;
  textStyle?: any;
}

const TexturedText: React.FC<TexturedTextProps> = ({
  text,
  textureSource,
  style,
  textStyle,
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
        <Image
          source={textureSource}
          style={styles.texture}
        />
      </MaskedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: 180,
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
  texture: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default TexturedText;
