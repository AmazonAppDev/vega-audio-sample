import {
  IMediaSessionId,
  ITimeValue,
} from '@amazon-devices/kepler-media-controls';
import {
  AudioPlayer,
  KeplerMediaControlHandler,
} from '@amazon-devices/react-native-w3cmedia';
import { DEFAULT_SEEK_SECONDS } from '../screens/Player';

/**
 * Custom media control handler with TV remote integration
 */
export class AppOverrideMediaControlHandler extends KeplerMediaControlHandler {
  private audioPlayer: AudioPlayer | null = null;
  private clientOverrideNeeded: boolean = false;
  private static SEEK_BACKWARD: number = -DEFAULT_SEEK_SECONDS;
  private static SEEK_FORWARD: number = DEFAULT_SEEK_SECONDS;

  /**
   * Creates media control handler with configurable override behavior
   */
  constructor(audioPlayer: AudioPlayer, overrideNeeded: boolean) {
    super();
    this.audioPlayer = audioPlayer;
    this.clientOverrideNeeded = overrideNeeded;
  }

  /**
   * Handles play command with direct AudioPlayer control
   */
  async handlePlay(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      console.log('AppOverrideMediaControlHandler handlePlay()');
      this.audioPlayer?.play();
    } else {
      console.log('AppOverrideMediaControlHandler default handlePlay()');
      super.handlePlay(mediaSessionId);
    }
  }
  /**
   * Handles pause command with direct AudioPlayer control
   */
  async handlePause(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      console.log('AppOverrideMediaControlHandler handlePause()');
      this.audioPlayer?.pause();
    } else {
      console.log('AppOverrideMediaControlHandler default handlePause()');
      super.handlePause(mediaSessionId);
    }
  }
  /**
   * Handles stop command (implemented as pause)
   */
  async handleStop(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      console.log('AppOverrideMediaControlHandler handleStop()');
      this.audioPlayer?.pause();
    } else {
      console.log('AppOverrideMediaControlHandler default handleStop()');
      super.handleStop(mediaSessionId);
    }
  }
  /**
   * Handles play/pause toggle with state detection
   */
  async handleTogglePlayPause(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      console.log('AppOverrideMediaControlHandler handleTogglePlayPause()');

      if (this.audioPlayer?.paused) {
        this.audioPlayer?.play();
      } else {
        this.audioPlayer?.pause();
      }
    } else {
      console.log(
        'AppOverrideMediaControlHandler default handleTogglePlayPause()',
      );
      super.handleTogglePlayPause(mediaSessionId);
    }
  }
  /**
   * Resets track to beginning and starts playback
   */
  async handleStartOver(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      console.log('AppOverrideMediaControlHandler handleStartOver()');
      this.audioPlayer!.currentTime = 0;
      this.audioPlayer?.play();
    } else {
      console.log('AppOverrideMediaControlHandler default handleStartOver()');
      super.handleStartOver(mediaSessionId);
    }
  }
  /**
   * Seeks forward by 10 seconds with boundary protection
   */
  async handleFastForward(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      console.log('AppOverrideMediaControlHandler handleFastForward()');

      let time = this.audioPlayer?.currentTime;
      const duration = this.audioPlayer?.duration;

      if (time === undefined || duration === undefined) {
        console.warn(
          `Could not seek forward ${AppOverrideMediaControlHandler.SEEK_FORWARD} seconds. currentTime=${time}, duration=${duration}`,
        );
        return;
      }

      time += AppOverrideMediaControlHandler.SEEK_FORWARD;
      this.audioPlayer!.currentTime = Math.min(time, duration);
    } else {
      console.log('AppOverrideMediaControlHandler default handleFastForward()');
      super.handleFastForward(mediaSessionId);
    }
  }
  /**
   * Seeks backward by 10 seconds with boundary protection
   */
  async handleRewind(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      console.log('AppOverrideMediaControlHandler handleRewind()');

      let time = this.audioPlayer?.currentTime;

      if (time === undefined) {
        console.warn(
          `Could not seek back ${AppOverrideMediaControlHandler.SEEK_BACKWARD} seconds. currentTime undefined`,
        );
        return;
      }

      time += AppOverrideMediaControlHandler.SEEK_BACKWARD;
      this.audioPlayer!.currentTime = Math.max(time, 0);
    } else {
      console.log('AppOverrideMediaControlHandler default handleRewind()');
      super.handleRewind(mediaSessionId);
    }
  }
  /**
   * Seeks to specific time position
   */
  async handleSeek(position: ITimeValue, mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      console.log('AppOverrideMediaControlHandler handleSeek()');
      this.audioPlayer?.fastSeek(position.seconds);
    } else {
      console.log('AppOverrideMediaControlHandler default handleSeek()');
      super.handleSeek(position, mediaSessionId);
    }
  }
}
