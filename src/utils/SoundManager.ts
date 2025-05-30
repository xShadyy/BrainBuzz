import {AppState, AppStateStatus, NativeModules} from 'react-native';
import Sound from 'react-native-sound';

// Sound files
const ambientSource = require('../assets/sounds/ambient.mp3');
const interactionSource = require('../assets/sounds/interaction.mp3');
const zap1Source = require('../assets/sounds/zap1.mp3');
const zap2Source = require('../assets/sounds/zap2.mp3');
const loginSuccessSource = require('../assets/sounds/login_success.mp3');
const countdownSource = require('../assets/sounds/countdown.mp3');
const quizCorrectSource = require('../assets/sounds/quiz_correct.mp3');
const quizIncorrectSource = require('../assets/sounds/quiz_incorrect.mp3');

// Android AudioManager interface
interface AudioManagerConstants {
  AUDIOFOCUS_GAIN: number;
  AUDIOFOCUS_LOSS: number;
  AUDIOFOCUS_LOSS_TRANSIENT: number;
  AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK: number;
}

const AudioFocusModule = NativeModules.AudioFocusModule || {
  requestAudioFocus: () => Promise.resolve(true),
  abandonAudioFocus: () => Promise.resolve(),
  constants: {} as AudioManagerConstants,
};

class SoundManager {
  // Ambient sound
  private static ambient: Sound | null = null;
  private static ambientVolume = 0.5;
  private static ambientEnabled = true;

  // Removed global and per-effect volume controls
  private static readonly DEFAULT_ZAP1_VOLUME = 0.8;
  private static readonly DEFAULT_ZAP2_VOLUME = 0.8;
  private static readonly DEFAULT_INTERACTION_VOLUME = 1.0;
  private static readonly DEFAULT_LOGIN_SUCCESS_VOLUME = 1.0;
  private static readonly DEFAULT_COUNTDOWN_VOLUME = 1.0;
  private static readonly DEFAULT_QUIZ_CORRECT_VOLUME = 1.0;
  private static readonly DEFAULT_QUIZ_INCORRECT_VOLUME = 1.0;

  // Sound pools
  private static zap1Pool: Sound[] = [];
  private static zap2Pool: Sound[] = [];
  private static interactionPool: Sound[] = [];
  private static loginSuccessPool: Sound[] = [];
  private static countdownPool: Sound[] = [];
  private static quizCorrectPool: Sound[] = [];
  private static quizIncorrectPool: Sound[] = [];
  private static POOL_SIZE = 3;

  // App state management
  private static appStateSubscription: {remove: () => void} | null = null;
  private static currentAppState: AppStateStatus = 'active';
  private static hasAudioFocus = false;

  private static _initialized = false;

  static async init() {
    if (this._initialized) {
      return;
    }
    this._initialized = true;
    // Initialize audio subsystem
    Sound.setCategory('Playback', true);
    console.log('[SoundManager] Initializing sounds...');

    // Load sounds
    try {
      this.ambient = await this.loadSound(ambientSource);
      this.zap1Pool = await this.createSoundPool(zap1Source, this.POOL_SIZE);
      this.zap2Pool = await this.createSoundPool(zap2Source, this.POOL_SIZE);
      this.interactionPool = await this.createSoundPool(
        interactionSource,
        this.POOL_SIZE,
      );
      this.loginSuccessPool = await this.createSoundPool(
        loginSuccessSource,
        this.POOL_SIZE,
      );
      this.countdownPool = await this.createSoundPool(
        countdownSource,
        this.POOL_SIZE,
      );
      this.quizCorrectPool = await this.createSoundPool(
        quizCorrectSource,
        this.POOL_SIZE,
      );
      this.quizIncorrectPool = await this.createSoundPool(
        quizIncorrectSource,
        this.POOL_SIZE,
      );
      console.log('[SoundManager] All sounds loaded successfully');
    } catch (error) {
      console.error('[SoundManager] Sound initialization failed:', error);
    }

    // Set up app state listener
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );

    // Initial audio focus
    await this.handleAudioFocus('active');
  }

  // -- Ambient Music Control --
  static async playAmbient() {
    if (!this.ambientEnabled || !this.ambient) {
      return;
    }

    if (this.ambient.isPlaying()) {
      return;
    }

    this.ambient.setNumberOfLoops(-1);
    this.ambient.setVolume(this.ambientVolume);
    this.ambient.play(success => {
      if (!success) {
        console.warn('Ambient playback failed');
      }
    });
  }

  static async fadeOutAmbient(duration = 2000) {
    if (!this.ambient) {
      return;
    }

    const startVolume = this.ambient.getVolume();
    const steps = 20;
    const stepTime = duration / steps;

    for (let i = 1; i <= steps; i++) {
      setTimeout(() => {
        const newVolume = startVolume * (1 - i / steps);
        this.ambient?.setVolume(newVolume);
      }, i * stepTime);
    }

    setTimeout(() => {
      this.ambient?.stop();
      this.ambientEnabled = false;
    }, duration);
  }

  // -- Sound Effects --
  static playZap1() {
    this.playFromPool(this.zap1Pool, this.DEFAULT_ZAP1_VOLUME);
  }

  static playZap2() {
    this.playFromPool(this.zap2Pool, this.DEFAULT_ZAP2_VOLUME);
  }

  static playInteraction() {
    this.playFromPool(this.interactionPool, this.DEFAULT_INTERACTION_VOLUME);
  }

  static playLoginSuccess() {
    this.playFromPool(this.loginSuccessPool, this.DEFAULT_LOGIN_SUCCESS_VOLUME);
    this.fadeOutAmbient();
  }

  static playCountdown() {
    this.playFromPool(this.countdownPool, this.DEFAULT_COUNTDOWN_VOLUME);
  }

  static playQuizCorrect() {
    if (!this.quizCorrectPool || this.quizCorrectPool.length === 0) {
      console.warn('[SoundManager] quizCorrectPool is empty or not loaded');
      return;
    }
    const availableSound = this.quizCorrectPool.find(
      (s: Sound) => !s.isPlaying(),
    );
    if (!availableSound) {
      console.warn('[SoundManager] No available quizCorrect sound in pool');
      return;
    }
    availableSound.setVolume(this.DEFAULT_QUIZ_CORRECT_VOLUME);
    availableSound.play(success => {
      if (!success) {
        console.warn('[SoundManager] quizCorrect sound playback failed');
      } else {
        console.log('[SoundManager] quizCorrect sound played');
      }
    });
  }

  static playQuizIncorrect() {
    if (!this.quizIncorrectPool || this.quizIncorrectPool.length === 0) {
      console.warn('[SoundManager] quizIncorrectPool is empty or not loaded');
      return;
    }
    const availableSound = this.quizIncorrectPool.find(
      (s: Sound) => !s.isPlaying(),
    );
    if (!availableSound) {
      console.warn('[SoundManager] No available quizIncorrect sound in pool');
      return;
    }
    availableSound.setVolume(this.DEFAULT_QUIZ_INCORRECT_VOLUME);
    availableSound.play(success => {
      if (!success) {
        console.warn('[SoundManager] quizIncorrect sound playback failed');
      } else {
        console.log('[SoundManager] quizIncorrect sound played');
      }
    });
  }

  // -- App State Management --
  private static handleAppStateChange = async (nextState: AppStateStatus) => {
    if (nextState === 'active') {
      await this.handleAudioFocus('active');
      this.resumeAllSounds();
    } else {
      await this.handleAudioFocus('background');
      this.pauseAllSounds();
    }
    this.currentAppState = nextState;
  };

  private static async handleAudioFocus(state: 'active' | 'background') {
    if (state === 'active') {
      try {
        this.hasAudioFocus = await AudioFocusModule.requestAudioFocus();
        if (this.hasAudioFocus) {
          Sound.setCategory('Playback', true);
        }
      } catch (error) {
        console.warn('Audio focus request failed:', error);
        this.hasAudioFocus = false;
      }
    } else {
      try {
        await AudioFocusModule.abandonAudioFocus();
      } catch (error) {
        console.warn('Audio focus abandonment failed:', error);
      }
      this.hasAudioFocus = false;
    }
  }

  // -- Helper Methods --
  private static loadSound(source: any): Promise<Sound> {
    return new Promise((resolve, reject) => {
      const sound = new Sound(source, error => {
        if (error) {
          reject(error);
        } else {
          resolve(sound);
        }
      });
    });
  }

  private static async createSoundPool(
    source: any,
    size: number,
  ): Promise<Sound[]> {
    const pool: Sound[] = [];
    for (let i = 0; i < size; i++) {
      try {
        const sound = await this.loadSound(source);
        pool.push(sound);
      } catch (error) {
        console.warn('Sound pool creation error:', error);
      }
    }
    return pool;
  }

  private static playFromPool(pool: Sound[], volume: number) {
    if (!this.hasAudioFocus) {
      return;
    }

    const availableSound = pool.find((s: Sound) => !s.isPlaying());
    if (availableSound) {
      availableSound.setVolume(volume);
      availableSound.play(success => {
        if (!success) {
          console.warn('Pool sound playback failed');
        }
      });
    }
  }

  private static playSound(sound: Sound | null, volume: number) {
    if (!this.hasAudioFocus || !sound) {
      console.warn(
        '[SoundManager] playSound: No audio focus or sound not loaded',
      );
      return;
    }
    sound.setVolume(volume);
    sound.play(success => {
      if (!success) {
        console.warn('[SoundManager] Sound playback failed');
      } else {
        console.log('[SoundManager] Sound played successfully');
      }
    });
  }

  private static pauseAllSounds() {
    this.ambient?.pause();
    this.zap1Pool.forEach((s: Sound) => s.pause());
    this.zap2Pool.forEach((s: Sound) => s.pause());
    this.interactionPool.forEach((s: Sound) => s.pause());
    this.loginSuccessPool.forEach((s: Sound) => s.pause());
    this.countdownPool.forEach((s: Sound) => s.pause());
    this.quizCorrectPool.forEach((s: Sound) => s.pause());
    this.quizIncorrectPool.forEach((s: Sound) => s.pause());
  }

  private static resumeAllSounds() {
    if (this.ambientEnabled) {
      this.playAmbient();
    }
  }

  static release() {
    this.appStateSubscription?.remove();

    this.ambient?.stop();
    this.ambient?.release();

    [
      this.zap1Pool,
      this.zap2Pool,
      this.interactionPool,
      this.loginSuccessPool,
      this.countdownPool,
      this.quizCorrectPool,
      this.quizIncorrectPool,
    ].forEach(pool => {
      pool.forEach((s: Sound) => {
        s.stop();
        s.release();
      });
    });

    AudioFocusModule.abandonAudioFocus().catch(() => {});
  }
}

export default SoundManager;
