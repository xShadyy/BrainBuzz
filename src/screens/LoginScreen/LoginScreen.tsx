import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  StatusBar,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import {styles} from './LoginScreen.styles.ts';
import {db} from '../../database';
import SoundManager from '../../utils/SoundManager';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/AppNavigator';

type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const successAnimationRef = useRef<LottieView>(null);
  const [successUserId, setSuccessUserId] = useState<number | null>(null);
  const formOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(formOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    return () => {};
  }, [formOpacity]);

  const validateEmailFormat = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setError('');
  };

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmailFormat(email)) {
      setError('Please enter a valid email');
      return;
    }

    try {
      setIsLoading(true);
      const user = await db.loginUser(email, password);
      if (user && user.id) {
        setError('');
        setSuccessUserId(user.id);
        SoundManager.playLoginSuccess();
        setTimeout(() => setShowSuccessAnimation(true), 100);
      } else {
        setError('Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      setSuccessUserId(null);
      setShowSuccessAnimation(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmailFormat(email)) {
      setError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const user = await db.registerUser(name, email, password);
      if (user && user.id) {
        Alert.alert('Success', 'Account created successfully!', [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              setIsRegistering(false);
            },
          },
        ]);
      } else {
        setError('Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    resetForm();
  };

  const handleAnimationFinish = () => {
    if (successUserId) {
      setShowSuccessAnimation(false);
      navigation.replace('Dashboard', {
        userId: successUserId,
        fromLogin: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent />

      <LottieView
        source={require('../../assets/animations/background.json')}
        autoPlay
        loop
        style={styles.backgroundAnimation}
        resizeMode="cover"
      />

      <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidView}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <Animated.View style={[styles.formContainer, {opacity: formOpacity}]}>
            {isRegistering && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor="#AAA"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#AAA"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#AAA"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={24}
                    color="#AAA"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {isRegistering && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor="#AAA"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }>
                    <MaterialIcons
                      name={
                        showConfirmPassword ? 'visibility' : 'visibility-off'
                      }
                      size={24}
                      color="#AAA"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={isRegistering ? handleRegister : handleLogin}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {isRegistering ? 'Register' : 'Login'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchModeButton}
              onPress={toggleMode}
              disabled={isLoading}>
              <Text style={styles.switchModeText}>
                {isRegistering
                  ? 'Already have an account? Login'
                  : "Don't have an account? Register"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        transparent
        visible={showSuccessAnimation}
        animationType="fade"
        onShow={() => {
          StatusBar.setTranslucent(false);
          StatusBar.setBackgroundColor('#0A0A3C');
        }}>
        <View style={styles.successAnimationContainer}>
          <View style={styles.successAnimationWrapper}>
            <LottieView
              ref={successAnimationRef}
              source={require('../../assets/animations/check.json')}
              autoPlay
              loop={false}
              style={styles.successAnimation}
              onAnimationFinish={handleAnimationFinish}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
