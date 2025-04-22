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
      animation: require('../assets/animations/fire_light_red.json'),
      name: 'Ember Spark',
      color: '#FF6B6B',
      progress: 100,
    },
    {
      animation: require('../assets/animations/fire_dark_blue.json'),
      name: 'Azure Flame',
      color: '#4ECDC4',
      progress: 80,
    },
    {
      animation: require('../assets/animations/fire_dark_green.json'),
      name: 'Emerald Blaze',
      color: '#88D8B0',
      progress: 60,
    },
    {
      animation: require('../assets/animations/fire_dark_magenta.json'),
      name: 'Mystic Inferno',
      color: '#F25F5C',
      progress: 40,
    },
    {
      animation: require('../assets/animations/fire_dark_purple.json'),
      name: 'Violet Pyre',
      color: '#9B5DE5',
      progress: 20,
    },
    {
      animation: require('../assets/animations/fire_light_red.json'),
      name: 'Shadow Blaze',
      color: '#556270',
      progress: 10,
    },
    {
      animation: require('../assets/animations/fire_dark_magenta.json'),
      name: 'Ethereal Fire',
      color: '#A7E8BD',
      progress: 5,
    },
    {
      animation: require('../assets/animations/fire_light_red.json'),
      name: 'Eternal Flame',
      color: '#343434',
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
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
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

      <ScrollView style={styles.contentContainer}>
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
              <TouchableOpacity
                style={styles.saveButtonContainer}
                onPress={handleSaveName}
                accessibilityLabel="Save name"
                accessibilityRole="button">
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
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
          <Text style={styles.animationProgressTitle}>
            Fire Animation Progress
          </Text>

          {/* Render the vertical fire animation progression */}
          {fireLevels.map((level, index) => {
            // Calculate connector line height for all but the last item
            const connectorHeight = index < fireLevels.length - 1 ? 12 : 0;

            return (
              <React.Fragment key={index}>
                <View style={styles.levelRowContainer}>
                  {/* Fire animation on the left */}
                  <View style={styles.animationContainer}>
                    <LottieView
                      source={level.animation}
                      autoPlay
                      loop
                      style={{width: 50, height: 50}}
                    />
                  </View>

                  {/* Progress bar in the middle */}
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

                    {/* Checkpoints on the progress bar */}
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

                  {/* Level name on the right */}
                  <View style={styles.levelNameContainer}>
                    <Text style={[styles.levelName, {color: level.color}]}>
                      {level.name}
                    </Text>
                  </View>
                </View>

                {/* Vertical connector between fire animations */}
                {index < fireLevels.length - 1 && (
                  <View
                    style={[styles.connectorLine, {height: connectorHeight}]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
