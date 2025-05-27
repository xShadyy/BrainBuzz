/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  BackHandler,
  TouchableOpacity,
  Animated,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {styles} from './DashboardScreen.styles';
import LottieView from 'lottie-react-native';
import {UserHeader} from '../../components/UserHeader';
import SoundManager from '../../utils/SoundManager';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useUser} from '../../utils/UserContext';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/AppNavigator';

interface CategoryItem {
  id: number;
  title: string;
  iconName: string;
  iconColor: string;
}

type DashboardScreenProps = StackScreenProps<RootStackParamList, 'Dashboard'>;

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  navigation,
  route,
}) => {
  const {userId, fromLogin = false} = route.params;
  const {user, isLoading: userLoading, refreshUser} = useUser();
  const loaderOpacity = useRef(new Animated.Value(1)).current;
  const dashboardOpacity = useRef(new Animated.Value(0)).current;
  const [loaderVisible, setLoaderVisible] = useState(fromLogin);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const hasUserBeenFetched = useRef(false);
  const minLoadingTime = 2000;

  // Set animation values based on whether we're coming from login
  useEffect(() => {
    if (!fromLogin) {
      // If not coming from login, make dashboard visible immediately
      loaderOpacity.setValue(0);
      dashboardOpacity.setValue(1);
    }
  }, []);

  // Categories data
  const categoryItems: CategoryItem[] = [
    {id: 1, title: 'Math', iconName: 'calculate', iconColor: '#1F77B4'},
    {id: 2, title: 'Science', iconName: 'science', iconColor: '#2CA02C'},
    {id: 3, title: 'History', iconName: 'history-edu', iconColor: '#8C564B'},
    {id: 4, title: 'Geography', iconName: 'public', iconColor: '#17BECF'},
    {id: 5, title: 'Languages', iconName: 'translate', iconColor: '#FF7F0E'},
    {id: 6, title: 'Literature', iconName: 'menu-book', iconColor: '#9467BD'},
    {id: 7, title: 'Art', iconName: 'palette', iconColor: '#D62728'},
    {id: 8, title: 'Music', iconName: 'music-note', iconColor: '#1B9E77'},
    {id: 9, title: 'Technology', iconName: 'memory', iconColor: '#636EFA'},
    {
      id: 10,
      title: 'Sports',
      iconName: 'sports-basketball',
      iconColor: '#FF5733',
    },
    {id: 11, title: 'Health', iconName: 'favorite', iconColor: '#E63946'},
    {id: 12, title: 'Space', iconName: 'rocket', iconColor: '#3F51B5'},
    {id: 13, title: 'Movies', iconName: 'movie-filter', iconColor: '#FFB703'},
    {id: 14, title: 'Animals', iconName: 'pets', iconColor: '#43AA8B'},
  ];

  // Define loadUser function using useCallback
  const loadUser = useCallback(async () => {
    if (hasUserBeenFetched.current) {return;}

    hasUserBeenFetched.current = true;
    try {
      await refreshUser(userId);
    } finally {
      setInitialLoadDone(true);
    }
  }, [userId, refreshUser]);

  // Load user data only once when component mounts
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Handle the loading animation timing separately from data fetching
  useEffect(() => {
    if (!initialLoadDone || !loaderVisible) {
      return;
    }

    // Minimum display time for the loader - only if coming from login
    if (fromLogin) {
      const timer = setTimeout(() => {
        // Start cross-fade animation
        Animated.parallel([
          Animated.timing(loaderOpacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(dashboardOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start(({finished}) => {
          if (finished) {
            setLoaderVisible(false);
          }
        });
      }, minLoadingTime);

      return () => clearTimeout(timer);
    }
  }, [
    initialLoadDone,
    loaderOpacity,
    dashboardOpacity,
    minLoadingTime,
    loaderVisible,
  ]);

  // Setup back button handler
  useEffect(() => {
    SoundManager.fadeOutAmbient();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert('Confirm', 'Do you want to logout?', [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Yes', onPress: handleLogout},
        ]);
        return true;
      },
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  const handleLogout = () => {
    // Restart ambient music when logging out
    SoundManager.playAmbient();

    // Navigate back to login screen
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  const handleItemPress = (itemId: number) => {
    // Play interaction sound
    SoundManager.playInteraction();

    // Find the selected category
    const category = categoryItems.find(i => i.id === itemId);
    if (category) {
      // Navigate to Quiz screen with appropriate parameters
      navigation.navigate('Quiz', {
        userId: userId,
        category: category.title,
      });
    }
  };

  const handleOpenSettings = () => {
    navigation.navigate('Settings', {userId: userId});
  };

  const renderCategoryItem = ({item}: {item: CategoryItem}) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => handleItemPress(item.id)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.title}`}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={item.iconName} size={50} color={item.iconColor} />
        <Text style={styles.categoryText}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Dashboard Content */}
      <Animated.View
        style={[StyleSheet.absoluteFillObject, {opacity: dashboardOpacity}]}>
        <View style={styles.backgroundContainer} />

        <UserHeader
          username={user?.name || 'USER'}
          onSettingsPress={handleOpenSettings}
          onLogoutPress={handleLogout}
        />

        <Animated.View style={styles.dashboardLayout}>
          <FlatList
            overScrollMode="never"
            data={categoryItems}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            style={{
              flex: 1,
              marginTop: 110,
            }}
            contentContainerStyle={{
              ...styles.contentContainer,
              paddingTop: 40,
            }}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.gridRow}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>BrainBuzz • Dashboard v1.0</Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Loading Overlay */}
      {loaderVisible && (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            styles.loadingContainer,
            {opacity: loaderOpacity},
          ]}
          pointerEvents={loaderVisible ? 'auto' : 'none'}>
          <LottieView
            source={require('../../assets/animations/loader.json')}
            autoPlay
            loop
            style={styles.loadingAnimation}
          />
        </Animated.View>
      )}
    </View>
  );
};
