import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    questionCount: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    questionText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    answersContainer: {
      marginTop: 20,
    },
    answerButton: {
      backgroundColor: '#f0f0f0',
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
    },
    correctAnswer: {
      backgroundColor: 'green',
    },
    wrongAnswer: {
      backgroundColor: 'red',
    },
    answerText: {
      fontSize: 16,
    },
    feedbackContainer: {
      marginTop: 20,
      padding: 15,
      borderRadius: 10,
      backgroundColor: '#f8f8f8',
    },
    correctText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'green',
      textAlign: 'center',
    },
    wrongText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'red',
      textAlign: 'center',
    },
    errorText: {
      fontSize: 16,
      color: 'red',
      textAlign: 'center',
    },
  });
