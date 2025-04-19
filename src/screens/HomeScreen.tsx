import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from '../components/Button';

export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to BrainBuzz</Text>
      <Button
        title="Get Started"
        onPress={() => console.log('Button pressed')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
