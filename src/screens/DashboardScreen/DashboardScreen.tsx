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
import {db} from '../../database';
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
  const loaderOpacity = useRef(new Animated.Value(fromLogin ? 1 : 0)).current;
  const dashboardOpacity = useRef(
    new Animated.Value(fromLogin ? 0 : 1),
  ).current;
  const [loaderVisible, setLoaderVisible] = useState(fromLogin);
  const [initialLoadDone, setInitialLoadDone] = useState(!fromLogin);
  const hasUserBeenFetched = useRef(false);
  const minLoadingTime = fromLogin ? 2000 : 0;
  const categoryItems: CategoryItem[] = [
    {id: 19, title: 'Math', iconName: 'calculate', iconColor: '#1F77B4'},
    {id: 17, title: 'Science', iconName: 'science', iconColor: '#2CA02C'},
    {id: 23, title: 'History', iconName: 'history-edu', iconColor: '#8C564B'},
    {id: 22, title: 'Geography', iconName: 'public', iconColor: '#17BECF'},
    {id: 9, title: 'Languages', iconName: 'translate', iconColor: '#FF7F0E'},
    {id: 10, title: 'Literature', iconName: 'menu-book', iconColor: '#9467BD'},
    {id: 25, title: 'Art', iconName: 'palette', iconColor: '#D62728'},
    {id: 12, title: 'Music', iconName: 'music-note', iconColor: '#1B9E77'},
    {id: 18, title: 'Technology', iconName: 'memory', iconColor: '#636EFA'},
    {
      id: 21,
      title: 'Sports',
      iconName: 'sports-basketball',
      iconColor: '#FF5733',
    },
    {id: 11, title: 'Movies', iconName: 'movie-filter', iconColor: '#FFB703'},
    {id: 27, title: 'Animals', iconName: 'pets', iconColor: '#43AA8B'},
  ];

  const loadUser = useCallback(async () => {
    if (hasUserBeenFetched.current) {
      return;
    }

    hasUserBeenFetched.current = true;
    try {
      await refreshUser(userId);
    } finally {
      setInitialLoadDone(true);
    }
  }, [userId, refreshUser]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!initialLoadDone || !loaderVisible || !fromLogin) {
      return;
    }

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(loaderOpacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(dashboardOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(({finished}) => {
        if (finished) {
          setLoaderVisible(false);
        }
      });
    }, minLoadingTime);

    return () => clearTimeout(timer);
  }, [initialLoadDone, fromLogin, minLoadingTime, loaderVisible]);

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
    SoundManager.playAmbient();

    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };
  const handleItemPress = (itemId: number) => {
    SoundManager.playInteraction();

    const category = categoryItems.find(i => i.id === itemId);
    if (category) {
      navigation.navigate('Quiz', {
        userId: userId,
        category: category.title,
        categoryId: category.id,
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
        </Animated.View>
      </Animated.View>

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
