import { AppState, AppStateStatus } from 'react-native';
const Sound = require('react-native-sound');

const ambientSource = require('../assets/sounds/ambient.mp3');
const zapSource = require('../assets/sounds/zap.mp3');

class SoundManager {
  private static ambient: any = null;
  private static zap: any = null;
  private static zap2: any = null;
  private static appStateSubscription: { remove: () => void } | null = null;
  private static currentAppState: AppStateStatus = AppState.currentState;

  static init() {
    Sound.setCategory('Playback');

    if (!this.ambient) {
      this.ambient = new Sound(ambientSource, (err: any) => {
        if (err) {
          console.warn('SoundManager: ambient load failed', err);
          return;
        }
        this.ambient.setNumberOfLoops(-1);
        this.ambient.setVolume(0.7);
        this.ambient.play((success: boolean) => {
          if (!success) {console.warn('SoundManager: ambient playback error');}
        });
      });
    }

    if (!this.zap) {
      this.zap = new Sound(zapSource, (err: any) => {
        if (err) {
          console.warn('SoundManager: zap load failed', err);
        }
      });
    }

    if (!this.zap2) {
      this.zap2 = new Sound(zapSource, (err: any) => {
        if (err) {
          console.warn('SoundManager: zap2 load failed', err);
        }
      });
    }

    if (!this.appStateSubscription) {
      this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
    }
  }

  private static handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      this.currentAppState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.ambient?.play();
    } else if (
      nextAppState.match(/inactive|background/)
    ) {
      this.ambient?.pause();

      if (this.zap && this.zap.isPlaying()) {
        this.zap.stop();
      }

      if (this.zap2 && this.zap2.isPlaying()) {
        this.zap2.stop();
      }
    }
    this.currentAppState = nextAppState;
  };

  static playZap() {
    if (this.zap && this.currentAppState === 'active') {
      this.zap.setVolume(1);
      this.zap.play((success: boolean) => {
        if (!success) {console.warn('SoundManager: zap playback error');}
      });
    }
  }

  static playSecondZap() {
    if (this.zap2 && this.currentAppState === 'active') {
      this.zap2.setVolume(1);
      this.zap2.play((success: boolean) => {
        if (!success) {console.warn('SoundManager: zap2 playback error');}
      });
    }
  }

  static release() {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
    this.ambient?.stop(() => this.ambient?.release());
    this.zap?.release();
    this.zap2?.release();
    this.ambient = null;
    this.zap = null;
    this.zap2 = null;
  }
}

export default SoundManager;
