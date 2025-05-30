/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef, useCallback} from 'react';
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
import {styles} from './SettingsScreen.styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import {db} from '../../database';
import SoundManager from '../../utils/SoundManager';
import {useUser} from '../../utils/UserContext';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/AppNavigator';

type SettingsScreenProps = StackScreenProps<RootStackParamList, 'Settings'>;

interface FireLevel {
  animation: any;
  name: string;
  color: string;
  progress: number;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  navigation,
  route,
}) => {
  const {userId} = route.params;
  const {user, refreshUser} = useUser();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [isXpTestingVisible, setIsXpTestingVisible] = useState(false);
  const [customXpAmount, setCustomXpAmount] = useState('');
  const hasInitialized = useRef(false);

  // Remove loading states - we don't need the loading animation anymore
  const contentOpacity = useRef(new Animated.Value(1)).current; // Start fully visible

  const fireLevels: FireLevel[] = [
    {
      animation: require('../../assets/animations/fire_sunny_beige_lighter.json'),
      name: 'Ember Spark',
      color: '#FF6B6B',
      progress: 100,
    },
    {
      animation: require('../../assets/animations/fire_sunny_beige_light.json'),
      name: 'Sun Flame',
      color: '#FF5C8D',
      progress: 80,
    },
    {
      animation: require('../../assets/animations/fire_sky_blue_lighter.json'),
      name: 'Azure Flame',
      color: '#4ECDC4',
      progress: 60,
    },
    {
      animation: require('../../assets/animations/fire_sky_blue_light.json'),
      name: 'Sapphire Blaze',
      color: '#5DA9E9',
      progress: 40,
    },
    {
      animation: require('../../assets/animations/fire_spring_green_lighter.json'),
      name: 'Emerald Inferno',
      color: '#6EEB83',
      progress: 20,
    },
    {
      animation: require('../../assets/animations/fire_spring_green_light.json'),
      name: 'Jade Pyre',
      color: '#50CB86',
      progress: 10,
    },
    {
      animation: require('../../assets/animations/fire_cherry_pink_lighter.json'),
      name: 'Mystical Aura',
      color: '#A9B7C0',
      progress: 5,
    },
    {
      animation: require('../../assets/animations/fire_cherry_pink_light.json'),
      name: 'Eternal Storm',
      color: '#BD3039',
      progress: 0,
    },
  ];

  // Use useCallback to memoize the initialization function
  const initializeUser = useCallback(async () => {
    if (hasInitialized.current) {return;}

    if (user) {
      setNewName(user.name);
    } else if (userId) {
      await refreshUser(userId);
    }
    hasInitialized.current = true;
  }, [userId, user, refreshUser]);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  useEffect(() => {
    // Update name when user changes
    if (user && !isEditingName) {
      setNewName(user.name);
    }
  }, [user, isEditingName]);

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

    if (!user) {
      return;
    }

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

  const handleAwardXP = async (amount: number) => {
    if (!user?.id) {
      Alert.alert('Error', 'User not found');
      return;
    }

    try {
      await db.awardXP(user.id, amount);
      await refreshUser(user.id);
      SoundManager.playInteraction();
      Alert.alert('Success', `Awarded ${amount} XP successfully!`);
    } catch (error) {
      console.error('Error awarding XP:', error);
      Alert.alert('Error', 'Failed to award XP');
    }
  };

  const handleCustomXP = async () => {
    const amount = parseInt(customXpAmount, 10);
    if (isNaN(amount) || amount === 0) {
      Alert.alert('Error', 'Please enter a valid XP amount (positive or negative)');
      return;
    }

    await handleAwardXP(amount);
    setCustomXpAmount('');
  };

  const handleSetLevel = async (targetLevel: number) => {
    if (!user?.id) {
      Alert.alert('Error', 'User not found');
      return;
    }

    try {
      const targetXP = db.getXPRequiredForLevel(targetLevel - 1);
      const currentXP = user.xp || 0;
      const xpDifference = targetXP - currentXP;

      await db.awardXP(user.id, xpDifference);
      await refreshUser(user.id);
      SoundManager.playInteraction();
      Alert.alert('Success', `Set to Level ${targetLevel} (${targetXP} XP)!`);
    } catch (error) {
      console.error('Error setting level:', error);
      Alert.alert('Error', 'Failed to set level');
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

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

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
                      <Text style={styles.fieldValueSupercharge}>
                        {user?.name || 'Unknown'}
                        <Text style={{color: 'transparent', fontFamily: 'Supercharge-JRgPo'}}>
                          {' '}
                        </Text>
                      </Text>
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
                          newName.trim() === user?.name?.trim() && {
                            opacity: 0.5,
                          },
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
                  <Text style={styles.fieldValue}>
                    {user?.email || 'Unknown'}
                  </Text>
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Account Created</Text>
                  <Text style={styles.fieldValue}>
                    {formatDate(user?.creationDate)}
                  </Text>
                </View>
              </View>

              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.fieldContainer}
                  onPress={() => {
                    setIsXpTestingVisible(!isXpTestingVisible);
                    SoundManager.playInteraction();
                  }}>
                  <Text style={styles.fieldLabel}>XP Testing</Text>
                  <MaterialIcons
                    name={isXpTestingVisible ? 'expand-less' : 'expand-more'}
                    size={20}
                    color="#FFC107"
                  />
                </TouchableOpacity>

                {isXpTestingVisible && (
                  <>
                    <View style={styles.xpTestingContainer}>
                      <Text style={styles.xpTestingTitle}>Current Status</Text>
                      <Text style={styles.xpTestingInfo}>
                        Level: {user?.level || 1} | XP: {user?.xp || 0}
                      </Text>
                    </View>

                    <View style={styles.xpTestingContainer}>
                      <Text style={styles.xpTestingTitle}>Quick XP Awards</Text>
                      <View style={styles.xpButtonRow}>
                        <TouchableOpacity
                          style={[styles.xpButton, {backgroundColor: '#4CAF50'}]}
                          onPress={() => handleAwardXP(50)}>
                          <Text style={styles.xpButtonText}>+50 XP</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.xpButton, {backgroundColor: '#2196F3'}]}
                          onPress={() => handleAwardXP(100)}>
                          <Text style={styles.xpButtonText}>+100 XP</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.xpButton, {backgroundColor: '#9C27B0'}]}
                          onPress={() => handleAwardXP(150)}>
                          <Text style={styles.xpButtonText}>+150 XP</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.xpTestingContainer}>
                      <Text style={styles.xpTestingTitle}>Custom XP Amount</Text>
                      <View style={styles.customXpContainer}>
                        <TextInput
                          style={styles.customXpInput}
                          value={customXpAmount}
                          onChangeText={setCustomXpAmount}
                          placeholder="Enter XP (+ or -)"
                          placeholderTextColor="#888888"
                          keyboardType="numeric"
                        />
                        <TouchableOpacity
                          style={[
                            styles.customXpButton,
                            !customXpAmount.trim() && {opacity: 0.5},
                          ]}
                          onPress={handleCustomXP}
                          disabled={!customXpAmount.trim()}>
                          <Text style={styles.customXpButtonText}>Apply</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.xpTestingContainer}>
                      <Text style={styles.xpTestingTitle}>Set Level Directly</Text>
                      <View style={styles.levelButtonContainer}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(level => (
                          <TouchableOpacity
                            key={level}
                            style={[
                              styles.levelButton,
                              user?.level === level && styles.levelButtonActive,
                            ]}
                            onPress={() => handleSetLevel(level)}>
                            <Text
                              style={[
                                styles.levelButtonText,
                                user?.level === level && styles.levelButtonTextActive,
                              ]}>
                              L{level}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </>
                )}
              </View>
            </View>

            <View style={styles.animationProgressContainer}>
              <Text style={styles.animationProgressTitle}>
                Fire Animation Progress
              </Text>
              {fireLevels.map((level, index) => {
                const isLastItem = index === fireLevels.length - 1;
                // Reverse level numbering: Level 1 = highest fire (index 0), Level 8 = lowest fire (index 7)
                const levelNumber = 8 - index; // Level 8, 7, 6, 5, 4, 3, 2, 1
                const userLevel = user?.level || 1;
                const userXP = user?.xp || 0;

                // Calculate progress for each level using new thresholds
                let progress = 0;
                if (userLevel > levelNumber) {
                  progress = 100; // Completed levels
                } else if (userLevel === levelNumber) {
                  // Current level - show XP progress within this level
                  const levelThresholds = [0, 500, 750, 1125, 1688, 2531, 3797, 5696, 9999];
                  const currentLevelMin = levelThresholds[levelNumber - 1] || 0;
                  const currentLevelMax = levelThresholds[levelNumber] || 9999;
                  const levelXP = userXP - currentLevelMin;
                  const levelXPNeeded = currentLevelMax - currentLevelMin;
                  progress = Math.min(100, Math.max(0, (levelXP / levelXPNeeded) * 100));
                } else {
                  progress = 0; // Future levels
                }

                return (
                  <View
                    key={index}
                    style={[
                      styles.levelRowContainer,
                      isLastItem ? {marginBottom: 2} : null,
                    ]}>
                    <View style={styles.animationContainer}>
                      <LottieView
                        source={level.animation}
                        autoPlay={userLevel >= levelNumber}
                        loop={userLevel >= levelNumber}
                        style={{width: 42, height: 42, alignSelf: 'center'}}
                      />
                    </View>
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${progress}%`,
                            backgroundColor: level.color,
                            opacity: userLevel >= levelNumber ? 1 : 0.3,
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
                      <Text style={[
                        styles.levelName,
                        {
                          color: userLevel >= levelNumber ? level.color : 'rgba(255,255,255,0.3)',
                        },
                      ]}>
                        {level.name}
                      </Text>
                      <Text style={[
                        styles.levelName,
                        {
                          fontSize: 12,
                          color: userLevel >= levelNumber ? level.color : 'rgba(255,255,255,0.3)',
                        },
                      ]}>
                        Level {levelNumber}
                      </Text>
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
