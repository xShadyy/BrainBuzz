import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

const {width} = Dimensions.get('window');

export const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [slideAnim] = useState(new Animated.Value(0));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = () => {
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);

    if (Object.values(newErrors).every(error => !error)) {
      // Handle successful login/register
      Alert.alert(
        'Success',
        isLogin ? 'Login successful!' : 'Registration successful!',
      );
    }
  };

  const toggleAuth = () => {
    Animated.spring(slideAnim, {
      toValue: isLogin ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
    setIsLogin(!isLogin);
    setErrors({email: '', password: '', confirmPassword: ''});
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BrainBuzz</Text>
        <Text style={styles.subtitle}>
          {isLogin ? 'Welcome back!' : 'Create an account'}
        </Text>
      </View>

      <View style={styles.formsWrapper}>
        <Animated.View
          style={[
            styles.formContainer,
            {
              transform: [{translateX}],
            },
          ]}>
          {/* Login Form */}
          <View style={styles.form}>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="Email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* Register Form */}
          <View style={styles.form}>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="Email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            <TextInput
              style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
              placeholder="Confirm Password"
              placeholderTextColor="#666"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      <TouchableOpacity style={styles.toggleButton} onPress={toggleAuth}>
        <Text style={styles.toggleText}>
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  formsWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  formContainer: {
    flexDirection: 'row',
    width: width * 2,
  },
  form: {
    width: width,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 15,
    marginBottom: 5,
    fontSize: 16,
    color: '#000',
    width: '100%',
    maxWidth: 400,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    maxWidth: 400,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleButton: {
    marginTop: 20,
    padding: 15,
  },
  toggleText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
  },
});
