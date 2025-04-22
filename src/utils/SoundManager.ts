import { AppState, AppStateStatus, NativeModules } from 'react-native';
const Sound = require('react-native-sound');

// Added ambient sound source
const ambientSource = require('../assets/sounds/ambient.mp3');
const interactionSource = require('../assets/sounds/interaction.mp3');
const zap1Source = require('../assets/sounds/zap1.mp3');
const zap2Source = require('../assets/sounds/zap2.mp3');
const loginSuccessSource = require('../assets/sounds/login_success.mp3');

// Android AudioManager constants
interface AudioManagerConstants {
  AUDIOFOCUS_GAIN: number;
  AUDIOFOCUS_LOSS: number;
  AUDIOFOCUS_LOSS_TRANSIENT: number;
  AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK: number;
}

// Native module for audio focus (Android only)
const AudioFocusModule =
  NativeModules.AudioFocusModule || {
    requestAudioFocus: () => Promise.resolve(true),
    abandonAudioFocus: () => Promise.resolve(),
    audioFocusChangeListener: null,
    constants: {} as AudioManagerConstants,
  };

class SoundManager {
  // Added ambient sound property
  private static ambient: any = null;
  private static interaction: any = null;
  private static zap1: any = null;
  private static zap2: any = null;
  private static loginSuccess: any = null;
  private static appStateSubscription: { remove: () => void } | null = null;
  private static currentAppState: AppStateStatus = AppState.currentState;
  private static isInitialized: boolean = false;
  private static hasAudioFocus: boolean = false;
  private static fadeInterval: ReturnType<typeof setInterval> | null = null;
  private static ambientVolume: number = 0.5; // Default ambient volume
  private static ambientEnabled: boolean = true; // Ambient sound enabled by default

  static async init() {
    if (this.isInitialized) {return;}

    Sound.setCategory('SoundEffect', false);

    // Always request Android audio focus
    try {
      this.hasAudioFocus = await AudioFocusModule.requestAudioFocus();
      if (!this.hasAudioFocus) {
        console.warn('SoundManager: Could not get audio focus');
      }
    } catch (error) {
      console.warn('SoundManager: Error requesting audio focus', error);
      this.hasAudioFocus = false;
    }

    // Ambient background music
    if (!this.ambient) {
      this.ambient = new Sound(ambientSource, (err: any) => {
        if (err) {
          console.warn('SoundManager: ambient load failed', err);
        } else {
          // Play ambient sound on app initialization
          this.playAmbient();
        }
      });
    }

    // One‑shot effects
    if (!this.interaction) {
      this.interaction = new Sound(interactionSource, (err: any) => {
        if (err) {console.warn('SoundManager: interaction load failed', err);}
      });
    }
    if (!this.zap1) {
      this.zap1 = new Sound(zap1Source, (err: any) => {
        if (err) {console.warn('SoundManager: zap1 load failed', err);}
      });
    }
    if (!this.zap2) {
      this.zap2 = new Sound(zap2Source, (err: any) => {
        if (err) {console.warn('SoundManager: zap2 load failed', err);}
      });
    }
    if (!this.loginSuccess) {
      this.loginSuccess = new Sound(loginSuccessSource, (err: any) => {
        if (err) {console.warn('SoundManager: login_success load failed', err);}
      });
    }

    // Listen for background/foreground
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
    this.isInitialized = true;
  }

  private static handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      AudioFocusModule.requestAudioFocus()
        .then((granted: boolean) => {
          this.hasAudioFocus = granted;
          // Resume ambient sound when app becomes active
          if (this.ambient && !this.ambient.isPlaying()) {
            this.playAmbient();
          }
        })
        .catch((err: any) => {
          console.warn('SoundManager: Error requesting audio focus', err);
        });

    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      if (this.hasAudioFocus) {
        AudioFocusModule.abandonAudioFocus().catch((err: any) => {
          console.warn('SoundManager: Error abandoning audio focus', err);
        });
        this.hasAudioFocus = false;
      }

      // Pause ambient sound in background
      if (this.ambient?.isPlaying()) {
        this.ambient.pause();
      }

      // Stop all sound effects in background
      if (this.interaction?.isPlaying()) {this.interaction.stop();}
      if (this.zap1?.isPlaying()) {this.zap1.stop();}
      if (this.zap2?.isPlaying()) {this.zap2.stop();}
      if (this.loginSuccess?.isPlaying()) {this.loginSuccess.stop();}
    }

    this.currentAppState = nextAppState;
  };

  // Add ambient sound control methods
  static playAmbient() {
    if (this.ambient && this.currentAppState === 'active' && this.hasAudioFocus && this.ambientEnabled) {
      // Set as looping background sound
      this.ambient.setNumberOfLoops(-1); // -1 means loop forever
      this.ambient.setVolume(this.ambientVolume);

      if (!this.ambient.isPlaying()) {
        this.ambient.play((success: boolean) => {
          if (!success) {console.warn('SoundManager: ambient playback error');}
        });
      }
    }
  }

  static stopAmbient() {
    if (this.ambient?.isPlaying()) {
      this.ambient.stop();
    }
  }

  static fadeOutAmbient(duration: number = 2000) {
    // Clear any existing fade interval
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    if (this.ambient && this.ambient.isPlaying()) {
      const startVolume = this.ambientVolume;
      const steps = 20;
      const volumeStep = startVolume / steps;
      const intervalTime = duration / steps;
      let currentStep = 0;

      this.fadeInterval = setInterval(() => {
        currentStep++;
        const newVolume = startVolume - (volumeStep * currentStep);

        if (currentStep >= steps || newVolume <= 0) {
          // End of fade out
          if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
          }

          this.ambient.setVolume(0);
          this.ambient.stop();
          // Reset volume for next time
          this.ambient.setVolume(this.ambientVolume);
        } else {
          this.ambient.setVolume(newVolume);
        }
      }, intervalTime);
    }
  }

  static playInteraction() {
    if (this.interaction && this.currentAppState === 'active' && this.hasAudioFocus) {
      this.interaction.setVolume(1);
      this.interaction.play((success: boolean) => {
        if (!success) {console.warn('SoundManager: interaction playback error');}
      });
    }
  }

  static playZap1() {
    if (this.zap1 && this.currentAppState === 'active' && this.hasAudioFocus) {
      this.zap1.setVolume(0.8);
      this.zap1.play((success: boolean) => {
        if (!success) {console.warn('SoundManager: zap1 playback error');}
      });
    }
  }

  static playZap2() {
    if (this.zap2 && this.currentAppState === 'active' && this.hasAudioFocus) {
      this.zap2.setVolume(0.8);
      this.zap2.play((success: boolean) => {
        if (!success) {console.warn('SoundManager: zap2 playback error');}
      });
    }
  }

  static playLoginSuccess() {
    if (this.loginSuccess && this.currentAppState === 'active' && this.hasAudioFocus) {
      this.loginSuccess.setVolume(1.0);
      this.loginSuccess.play((success: boolean) => {
        if (!success) {console.warn('SoundManager: login_success playback error');}

        // Completely stop ambient sound when login is successful
        this.fadeOutAmbient();
        this.ambientEnabled = false; // Disable ambient sound after successful login
      });
    }
  }

  // Method to completely disable ambient music (can be called from dashboard)
  static disableAmbient() {
    this.stopAmbient();
    this.ambientEnabled = false;
  }

  // Method to re-enable ambient music if needed
  static enableAmbient() {
    this.ambientEnabled = true;
    this.playAmbient();
  }

  static release() {
    this.appStateSubscription?.remove();
    this.appStateSubscription = null;

    if (this.hasAudioFocus) {
      AudioFocusModule.abandonAudioFocus().catch((err: any) => {
        console.warn('SoundManager: Error abandoning audio focus', err);
      });
      this.hasAudioFocus = false;
    }

    // Clear fade interval if active
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    // Release ambient sound
    this.ambient?.release();
    this.ambient = null;

    this.interaction?.release();
    this.interaction = null;

    this.zap1?.release();
    this.zap1 = null;

    this.zap2?.release();
    this.zap2 = null;

    this.loginSuccess?.release();
    this.loginSuccess = null;

    this.isInitialized = false;
  }
}

export default SoundManager;
