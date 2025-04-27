/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  StatusBar,
  Animated,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import {styles} from './Settings.styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import {db} from '../database';
import SoundManager from '../utils/SoundManager';
import {useUser} from '../utils/UserContext';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type SettingsScreenProps = StackScreenProps<RootStackParamList, 'Settings'>;

interface FireLevel {
  animation: any;
  name: string;
  color: string;
  progress: number;
}

export const Settings: React.FC<SettingsScreenProps> = ({ navigation, route }) => {
  const { userId } = route.params;
  const {user, refreshUser} = useUser();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  // Remove loading states - we don't need the loading animation anymore
  const contentOpacity = useRef(new Animated.Value(1)).current; // Start fully visible

  const fireLevels: FireLevel[] = [
    {
      animation: require('../assets/animations/fire_sunny_beige_lighter.json'),
      name: 'Ember Spark',
      color: '#FF6B6B',
      progress: 100,
    },
    {
      animation: require('../assets/animations/fire_sunny_beige_light.json'),
      name: 'Sun Flame',
      color: '#FF5C8D',
      progress: 80,
    },
    {
      animation: require('../assets/animations/fire_sky_blue_lighter.json'),
      name: 'Azure Flame',
      color: '#4ECDC4',
      progress: 60,
    },
    {
      animation: require('../assets/animations/fire_sky_blue_light.json'),
      name: 'Sapphire Blaze',
      color: '#5DA9E9',
      progress: 40,
    },
    {
      animation: require('../assets/animations/fire_spring_green_lighter.json'),
      name: 'Emerald Inferno',
      color: '#6EEB83',
      progress: 20,
    },
    {
      animation: require('../assets/animations/fire_spring_green_light.json'),
      name: 'Jade Pyre',
      color: '#50CB86',
      progress: 10,
    },
    {
      animation: require('../assets/animations/fire_cherry_pink_lighter.json'),
      name: 'Mystical Aura',
      color: '#A9B7C0',
      progress: 5,
    },
    {
      animation: require('../assets/animations/fire_cherry_pink_light.json'),
      name: 'Eternal Storm',
      color: '#FFFFFF',
      progress: 0,
    },
  ];

  useEffect(() => {
    // Initialize name if user exists
    if (user) {
      setNewName(user.name);
    } else if (userId) {
      refreshUser(userId);
    }
  }, [userId, user, refreshUser]);

  const handleBackPress = () => {
    SoundManager.playInteraction();
    navigation.goBack();
  };

  const handleEditName = () => {
    SoundManager.playInteraction();
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    if (!user) {return;}

    try {
      const updatedUser = {...user, name: newName.trim()};
      const success = await db.updateUser(updatedUser);

      if (success) {
        // Update local user context state immediately
        refreshUser(userId);
        setIsEditingName(false);
        SoundManager.playInteraction();
        Alert.alert('Success', 'Name updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update name');
      }
    } catch (error) {
      console.error('Error updating name:', error);
      Alert.alert('Error', 'An error occurred while updating your name');
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) {return 'Unknown';}
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <Animated.View style={{flex: 1, opacity: contentOpacity}}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            accessibilityLabel="Go back to dashboard"
            accessibilityRole="button">
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.contentWrapper}>
          <View style={styles.staticContentContainer}>
            <View>
              <Text style={styles.sectionTitle}>Account Information</Text>
              <View style={styles.card}>
                {!isEditingName ? (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Name</Text>
                    <View style={styles.fieldNameContainer}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleEditName}>
                        <MaterialIcons name="edit" size={18} color="#FFC107" />
                      </TouchableOpacity>
                      <Text style={styles.fieldValue}>{user?.name || 'Unknown'}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.editNameContainer}>
                    <Text style={styles.fieldLabel}>Name</Text>
                    <TextInput
                      style={styles.editNameInput}
                      value={newName}
                      onChangeText={setNewName}
                      autoFocus
                      placeholder="Enter your name"
                      placeholderTextColor="#888888"
                    />
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={[
                          styles.saveButton,
                          newName.trim() === user?.name?.trim() && {opacity: 0.5},
                        ]}
                        onPress={() => {
                          SoundManager.playInteraction();
                          handleSaveName();
                        }}
                        disabled={newName.trim() === user?.name?.trim()}>
                        <Text style={styles.saveButtonText}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {
                          setIsEditingName(false);
                          setNewName(user?.name || '');
                          SoundManager.playInteraction();
                        }}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Email</Text>
                  <Text style={styles.fieldValue}>{user?.email || 'Unknown'}</Text>
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Account Created</Text>
                  <Text style={styles.fieldValue}>{formatDate(user?.creationDate)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.animationProgressContainer}>
              <Text style={styles.animationProgressTitle}>Fire Animation Progress</Text>
              {fireLevels.map((level, index) => {
                const isLastItem = index === fireLevels.length - 1;
                return (
                  <View key={index} style={[
                    styles.levelRowContainer,
                    isLastItem ? {marginBottom: 2} : null,
                  ]}>
                    <View style={styles.animationContainer}>
                      <LottieView
                        source={level.animation}
                        autoPlay
                        loop
                        style={{width: 42, height: 42, alignSelf: 'center'}}
                      />
                    </View>
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {width: `${level.progress}%`, backgroundColor: level.color},
                        ]}
                      />
                      {[25, 50, 75].map(checkpoint => (
                        <View
                          key={checkpoint}
                          style={[styles.checkpointMarker, {left: `${checkpoint}%`}]}
                        />
                      ))}
                    </View>
                    <View style={styles.levelNameContainer}>
                      <Text style={[styles.levelName, {color: level.color}]}>{level.name}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>BrainBuzz • Settings v1.0</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};
