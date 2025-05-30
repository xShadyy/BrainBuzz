/* eslint-disable @typescript-eslint/no-unused-vars */
import {NativeModules} from 'react-native';
import {User, DatabaseModule} from './types';

const {DatabaseModule: NativeDatabaseModule} = NativeModules;

class Database {
  /**
   * Add a new user to the database
   * @param name User's name
   * @param email User's email
   * @param password User's password
   * @returns Promise resolving to the new user ID
   */
  async addUser(
    name: string,
    email: string,
    password?: string,
  ): Promise<number> {
    try {
      return await NativeDatabaseModule.addUser({name, email, password});
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  /**
   * Register a new user account
   * @param name User's name
   * @param email User's email
   * @param password User's password
   * @returns Promise resolving to the newly created user
   */
  async registerUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    try {
      return await NativeDatabaseModule.registerUser({name, email, password});
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Login a user with email and password
   * @param email User's email
   * @param password User's password
   * @returns Promise resolving to the authenticated user
   */
  async loginUser(email: string, password: string): Promise<User> {
    try {
      return await NativeDatabaseModule.loginUser(email, password);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  /**
   * Get all users from the database
   * @returns Promise resolving to an array of users
   */
  async getUsers(): Promise<User[]> {
    try {
      return await NativeDatabaseModule.getUsers();
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  /**
   * Get a user by their ID
   * @param userId The user ID to look up
   * @returns Promise resolving to the user or null if not found
   */
  async getUserById(userId: number): Promise<User | null> {
    try {
      return await NativeDatabaseModule.getUserById(userId);
    } catch (error) {
      console.error(`Error getting user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update an existing user
   * @param user User object with updated fields
   * @returns Promise resolving to true if successful
   */
  async updateUser(user: User): Promise<boolean> {
    if (!user.id) {
      throw new Error('User ID is required for updates');
    }

    try {
      return await NativeDatabaseModule.updateUser(user);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete a user by their ID
   * @param userId The user ID to delete
   * @returns Promise resolving to true if successful
   */
  async deleteUser(userId: number): Promise<boolean> {
    try {
      return await NativeDatabaseModule.deleteUser(userId);
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Delete all users from the database
   * @returns Promise resolving to true if successful
   */
  async deleteAllUsers(): Promise<boolean> {
    try {
      return await NativeDatabaseModule.deleteAllUsers();
    } catch (error) {
      console.error('Error deleting all users:', error);
      throw error;
    }
  }

  /**
   * Award XP to a user and update their level if necessary
   * @param userId The user ID to award XP to
   * @param xpAmount The amount of XP to award
   * @returns Promise resolving to the updated user
   */
  async awardXP(userId: number, xpAmount: number): Promise<User | null> {
    try {
      return await NativeDatabaseModule.awardXP(userId, xpAmount);
    } catch (error) {
      console.error(`Error awarding XP to user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Calculate XP reward based on quiz performance
   * @param score Number of correct answers
   * @param totalQuestions Total number of questions
   * @param difficulty Quiz difficulty ('easy', 'medium', 'hard')
   * @returns XP amount to award
   */
  calculateXPReward(
    score: number,
    totalQuestions: number,
    difficulty: string,
  ): number {
    // Fixed XP rewards per difficulty - awarded for completing the quiz regardless of score
    const difficultyRewards = {
      easy: 50,
      medium: 100,
      hard: 150,
    };

    // Return fixed XP amount based on difficulty only
    return (
      difficultyRewards[difficulty as keyof typeof difficultyRewards] || 50
    );
  }

  /**
   * Get the level for a given XP amount
   * @param xp Current XP amount
   * @returns Current level (1-8)
   */
  getLevelFromXP(xp: number): number {
    // New level progression: 0, 500, 750, 1125, 1688, 2531, 3797, 5696 XP
    const levelThresholds = [0, 500, 750, 1125, 1688, 2531, 3797, 5696];

    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (xp >= levelThresholds[i]) {
        return Math.min(i + 1, 8); // Cap at level 8
      }
    }
    return 1;
  }

  /**
   * Get XP required for a specific level
   * @param level Level number (0 for current level start, 1-8 for level thresholds)
   * @returns XP required for that level
   */
  getXPRequiredForLevel(level: number): number {
    const levelThresholds = [0, 500, 750, 1125, 1688, 2531, 3797, 5696, 9999];
    return levelThresholds[Math.max(0, Math.min(level, 8))] || 0;
  }
}

export const db = new Database();
