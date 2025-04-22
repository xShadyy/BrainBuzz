/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {styles} from './Settings.styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import {db} from '../database';
import SoundManager from '../utils/SoundManager';
import {User} from '../database/types';

interface SettingsScreenProps {
  userId: number;
  onBack: () => void;
}

interface FireLevel {
  animation: any;
  name: string;
  color: string;
  progress: number; // 0-100
}

export const Settings: React.FC<SettingsScreenProps> = ({userId, onBack}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
    const fetchUserData = async () => {
      try {
        const userData = await db.getUserById(userId);
        if (userData) {
          setUser(userData);
          setNewName(userData.name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleBackPress = () => {
    SoundManager.playInteraction();
    onBack();
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

    if (!user) {
      return;
    }

    try {
      const updatedUser = {...user, name: newName.trim()};
      const success = await db.updateUser(updatedUser);

      if (success) {
        setUser(updatedUser);
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
    if (!timestamp) {
      return 'Unknown';
    }

    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
            <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            source={require('../assets/animations/lightning.json')}
            autoPlay
            loop
            style={{width: 100, height: 100}}
          />
          <Text
            style={{
              color: '#FFFFFF',
              marginTop: 20,
              fontFamily: 'Lexend-Medium',
            }}>
            Loading settings...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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

      <ScrollView
        overScrollMode="never"
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContentContainer}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.card}>
          {!isEditingName ? (
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Name</Text>
              <View style={styles.fieldNameContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleEditName}
                  accessibilityLabel="Edit name"
                  accessibilityRole="button">
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
                  style={[styles.saveButton, newName.trim() === user?.name?.trim() && {opacity: 0.5}]}
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
            <Text style={styles.fieldValue}>
              {formatDate(user?.creationDate)}
            </Text>
          </View>
        </View>

        <View style={styles.animationProgressContainer}>
          <Text style={styles.animationProgressTitle}>Fire Animation Progress</Text>
          {fireLevels.map((level, index) => {
            const isLastItem = index === fireLevels.length - 1;

            return (
              <React.Fragment key={index}>
                <View style={[styles.levelRowContainer, isLastItem ? {marginBottom: 0} : null]}>
                  <View style={styles.animationContainer}>
                    <LottieView
                      source={level.animation}
                      autoPlay
                      loop
                      style={{width: 50, height: 50}}
                    />
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${level.progress}%`,
                          backgroundColor: level.color,
                        },
                      ]}
                    />
                    {[25, 50, 75].map(checkpoint => (
                      <View
                        key={checkpoint}
                        style={[
                          styles.checkpointMarker,
                          {left: `${checkpoint}%`},
                        ]}
                      />
                    ))}
                  </View>
                  <View style={styles.levelNameContainer}>
                    <Text style={[styles.levelName, {color: level.color}]}>
                      {level.name}
                    </Text>
                  </View>
                </View>
              </React.Fragment>
            );
          })}
          {/* Remove progressClosingElement - we don't need extra space */}
        </View>

        {/* Reduce the height of the end spacer */}
        <View style={{height: 20}} />
      </ScrollView>
    </SafeAreaView>
  );
};
