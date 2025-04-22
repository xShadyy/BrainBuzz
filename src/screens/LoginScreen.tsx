import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  StatusBar, // Added StatusBar import
} from 'react-native';
import LottieView from 'lottie-react-native';
import {styles} from './LoginScreen.styles.ts';
import {db} from '../database';
import SoundManager from '../utils/SoundManager';

interface LoginScreenProps {
  onLoginSuccess?: (userId: number) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({onLoginSuccess}) => {
  // States for login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Additional states for registration
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // State for success animation
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const successAnimationRef = useRef<LottieView>(null);
  const [successUserId, setSuccessUserId] = useState<number | null>(null);

  // Form opacity animation
  const formOpacity = useRef(new Animated.Value(0)).current;

  // Initialize sound manager when component mounts
  useEffect(() => {
    SoundManager.init();
    console.log('LoginScreen mounted, SoundManager initialized');

    // Configure status bar for initial state - transparent with light content
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Fade in the form content immediately
  useEffect(() => {
    // Fade in the form right away
    Animated.timing(formOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
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
    console.log('Login button pressed with email:', email);

    // Clear any previous errors
    setError('');

    // Basic validation
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
      console.log('Attempting to log in with:', email);

      // For testing - create a test user if none exists
      try {
        const users = await db.getUsers();
        console.log('Current users in database:', users);
        if (!users || users.length === 0) {
          console.log('No users found, creating test user');
          await db.registerUser('Test User', 'test@example.com', 'password');
          console.log('Test user created');
        }
      } catch (err) {
        console.log('Error checking users:', err);
      }

      const user = await db.loginUser(email, password);
      console.log('Login result:', user);

      if (user && user.id) {
        console.log('Login successful for user ID:', user.id);
        setSuccessUserId(user.id);
        // Play sound first then show animation
        SoundManager.playLoginSuccess();
        console.log('Login success sound played');

        setTimeout(() => {
          setShowSuccessAnimation(true);
          console.log('Success animation shown');
        }, 100);
      } else {
        console.log('Login failed: User object invalid');
        setError('Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    // Clear any previous errors
    setError('');

    // Basic validation
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
    console.log('Success animation finished, userId:', successUserId);
    if (successUserId && onLoginSuccess) {
      console.log('Calling onLoginSuccess with userId:', successUserId);
      onLoginSuccess(successUserId);
      setShowSuccessAnimation(false);
    } else {
      console.warn('Cannot complete login: successUserId or onLoginSuccess is missing');
    }
  };

  return (
    <View style={styles.container}>
      {/* Use background.json animation instead of static background */}
      <LottieView
        source={require('../assets/animations/background.json')}
        autoPlay
        loop
        style={styles.backgroundAnimation}
        resizeMode="cover"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.formContainer, { opacity: formOpacity }]}>
            <View style={styles.headerContainer} />

            {isRegistering && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor="#AAA"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#AAA"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {isRegistering && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="#AAA"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            )}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={isRegistering ? handleRegister : handleLogin}
              disabled={isLoading}
            >
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
              disabled={isLoading}
            >
              <Text style={styles.switchModeText}>
                {isRegistering
                  ? 'Already have an account? Login'
                  : "Don't have an account? Register"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Animation Modal */}
      <Modal
        transparent={true}
        visible={showSuccessAnimation}
        animationType="fade"
        onShow={() => {
          // When animation modal shows, update status bar to match animation background
          StatusBar.setBarStyle('light-content');
          if (Platform.OS === 'android') {
            StatusBar.setTranslucent(false);
            StatusBar.setBackgroundColor('#0A0A3C'); // Match animation background
          }
        }}
        onDismiss={() => {
          // Restore status bar settings when modal is dismissed
          StatusBar.setBarStyle('light-content');
          if (Platform.OS === 'android') {
            StatusBar.setTranslucent(true);
            StatusBar.setBackgroundColor('transparent');
          }
        }}
      >
        <View style={styles.successAnimationContainer}>
          <View style={styles.successAnimationWrapper}>
            <LottieView
              ref={successAnimationRef}
              source={require('../assets/animations/check.json')}
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
