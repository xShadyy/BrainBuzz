export interface FireLevel {
  animation: any;
  name: string;
  color: string;
  level: number;
}

export class LevelManager {
  private static fireLevels: FireLevel[] = [
    {
      animation: require('../assets/animations/fire_cherry_pink_light.json'),
      name: 'Eternal Storm',
      color: '#BD3039',
      level: 8,
    },
    {
      animation: require('../assets/animations/fire_cherry_pink_lighter.json'),
      name: 'Mystical Aura',
      color: '#A9B7C0',
      level: 7,
    },
    {
      animation: require('../assets/animations/fire_spring_green_light.json'),
      name: 'Jade Pyre',
      color: '#50CB86',
      level: 6,
    },
    {
      animation: require('../assets/animations/fire_spring_green_lighter.json'),
      name: 'Emerald Inferno',
      color: '#6EEB83',
      level: 5,
    },
    {
      animation: require('../assets/animations/fire_sky_blue_light.json'),
      name: 'Sapphire Blaze',
      color: '#5DA9E9',
      level: 4,
    },
    {
      animation: require('../assets/animations/fire_sky_blue_lighter.json'),
      name: 'Azure Flame',
      color: '#4ECDC4',
      level: 3,
    },
    {
      animation: require('../assets/animations/fire_sunny_beige_light.json'),
      name: 'Sun Flame',
      color: '#FF5C8D',
      level: 2,
    },
    {
      animation: require('../assets/animations/fire_sunny_beige_lighter.json'),
      name: 'Ember Spark',
      color: '#FF6B6B',
      level: 1,
    },
  ];

  /**
   * Get fire level data for a specific level
   * @param level User level (1-8)
   * @returns FireLevel object
   */
  static getFireLevelForLevel(level: number): FireLevel {
    const fireLevel = this.fireLevels.find(
      fl => fl.level === Math.max(1, Math.min(8, level)),
    );
    return fireLevel || this.fireLevels[this.fireLevels.length - 1]; // Default to level 1
  }

  /**
   * Get all fire levels
   * @returns Array of FireLevel objects
   */
  static getAllFireLevels(): FireLevel[] {
    return [...this.fireLevels];
  }

  /**
   * Get level from XP amount
   * @param xp Current XP amount
   * @returns Current level (1-8)
   */
  static getLevelFromXP(xp: number): number {
    // Level progression: 0, 100, 250, 450, 700, 1000, 1350, 1750, 2200+ XP
    const levelThresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750];

    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (xp >= levelThresholds[i]) {
        return Math.min(i + 1, 8); // Cap at level 8
      }
    }
    return 1;
  }

  /**
   * Get XP required for next level
   * @param currentLevel Current user level
   * @returns XP required for next level
   */
  static getXPRequiredForLevel(currentLevel: number): number {
    const levelThresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200];
    return levelThresholds[Math.min(currentLevel, 8)] || 2200;
  }

  /**
   * Get current level progress percentage
   * @param currentXP Current XP amount
   * @param currentLevel Current level
   * @returns Progress percentage (0-100)
   */
  static getLevelProgress(currentXP: number, currentLevel: number): number {
    if (currentLevel >= 8) {
      return 100;
    }

    const currentLevelThreshold = this.getXPRequiredForLevel(currentLevel - 1);
    const nextLevelThreshold = this.getXPRequiredForLevel(currentLevel);

    const progressInLevel = currentXP - currentLevelThreshold;
    const requiredForNextLevel = nextLevelThreshold - currentLevelThreshold;

    return Math.min(
      100,
      Math.max(0, (progressInLevel / requiredForNextLevel) * 100),
    );
  }
}
