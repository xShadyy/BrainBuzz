import {AppState, AppStateStatus, NativeModules} from 'react-native';
import Sound from 'react-native-sound';

// Sound files
const ambientSource = require('../assets/sounds/ambient.mp3');
const interactionSource = require('../assets/sounds/interaction.mp3');
const zap1Source = require('../assets/sounds/zap1.mp3');
const zap2Source = require('../assets/sounds/zap2.mp3');
const loginSuccessSource = require('../assets/sounds/login_success.mp3');

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

  // Sound pools
  private static zap1Pool: Sound[] = [];
  private static zap2Pool: Sound[] = [];
  private static POOL_SIZE = 3;

  // Other sounds
  private static interaction: Sound | null = null;
  private static loginSuccess: Sound | null = null;

  // App state management
  private static appStateSubscription: {remove: () => void} | null = null;
  private static currentAppState: AppStateStatus = 'active';
  private static hasAudioFocus = false;

  static async init() {
    // Initialize audio subsystem
    Sound.setCategory('Playback', true);

    // Load sounds
    try {
      this.ambient = await this.loadSound(ambientSource);
      this.interaction = await this.loadSound(interactionSource);
      this.loginSuccess = await this.loadSound(loginSuccessSource);
      this.zap1Pool = await this.createSoundPool(zap1Source, this.POOL_SIZE);
      this.zap2Pool = await this.createSoundPool(zap2Source, this.POOL_SIZE);
    } catch (error) {
      console.error('Sound initialization failed:', error);
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
    this.playFromPool(this.zap1Pool, 0.8);
  }

  static playZap2() {
    this.playFromPool(this.zap2Pool, 0.8);
  }

  static playInteraction() {
    this.playSound(this.interaction, 1.0);
  }

  static playLoginSuccess() {
    this.playSound(this.loginSuccess, 1.0);
    this.fadeOutAmbient();
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
      return;
    }

    sound.setVolume(volume);
    sound.play(success => {
      if (!success) {
        console.warn('Sound playback failed');
      }
    });
  }

  private static pauseAllSounds() {
    this.ambient?.pause();
    this.zap1Pool.forEach((s: Sound) => s.pause());
    this.zap2Pool.forEach((s: Sound) => s.pause());
    this.interaction?.pause();
    this.loginSuccess?.pause();
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

    this.zap1Pool.forEach((s: Sound) => {
      s.stop();
      s.release();
    });
    this.zap2Pool.forEach((s: Sound) => {
      s.stop();
      s.release();
    });

    this.interaction?.stop();
    this.interaction?.release();

    this.loginSuccess?.stop();
    this.loginSuccess?.release();

    AudioFocusModule.abandonAudioFocus().catch(() => {});
  }
}

export default SoundManager;
