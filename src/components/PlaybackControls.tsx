/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL. USE IS SUBJECT TO LICENSE TERMS.
 */

/**
 * PlaybackControls Component
 *
 * TV-optimized audio control interface with hardware remote integration.
 * Features five buttons (previous, seek back, play/pause, seek forward, next)
 * with hardware remote integration and focus management.
 *
 * Key Features:
 * - TV remote hardware event handling (play/pause, skip forward/backward)
 * - Focus management with automatic button highlighting
 * - Seek functionality with 10-second intervals
 * - Track navigation (previous/next)
 * - Focus restriction to prevent navigation outside control area
 * - Integration with AudioPlayer for direct media control
 *
 * Control Layout:
 * - Previous Track → Seek Backward (-10s) → Play/Pause → Seek Forward (+10s) → Next Track
 * - All buttons wrapped in TVFocusGuideView with focus trapping
 * - Hardware remote buttons automatically focus corresponding controls
 *
 * TV Remote Integration:
 * - PLAY_PAUSE button → focuses play/pause control
 * - SKIP_FORWARD/SKIP_BACKWARD → focuses seek controls
 * - Automatic focus management on hardware button press
 * - Focus restoration after hardware events
 *
 * Example Usage:
 * ```tsx
 * <PlaybackControls
 *   audioRef={audioRef}
 *   onNextTrack={onNextTrack}
 *   onPreviousTrack={onPreviousTrack}
 *   isFocused={true}
 *   handleSeek={handleSeek}
 * />
 * ```
 */

// Vega functionality
import {
  HWEvent,
  TVFocusGuideView,
  useTVEventHandler,
} from '@amazon-devices/react-native-kepler';
import { AudioPlayer } from '@amazon-devices/react-native-w3cmedia';
import React, { useCallback, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

// Remote control constants
import { EVENT_KEY_DOWN, EVENT_KEY_UP, RemoteEvent } from '../Constants';

// Player configuration
import { DEFAULT_SEEK_SECONDS } from '../screens/Player';

// UI components
import PlayerButton from './PlayerButton';
import PlayPauseButton from './PlayPauseButton';

/**
 * Props for the PlaybackControls component
 */
type Props = {
  /**
   * Reference to the AudioPlayer instance for direct media control.
   * Used to check current playback state and control audio playback.
   */
  audioRef: React.MutableRefObject<AudioPlayer | null>;

  /**
   * Callback fired when the next track button is pressed.
   * Should handle playlist navigation and track switching logic.
   */
  onNextTrack: () => void;

  /**
   * Callback fired when the previous track button is pressed.
   * Should handle backward playlist navigation and track switching logic.
   */
  onPreviousTrack: () => void;

  /**
   * Whether the playback controls should respond to TV remote hardware events.
   * When false, hardware events are ignored to prevent conflicts with other screens.
   */
  isFocused?: boolean;

  /**
   * Callback for handling seek operations (forward/backward).
   * Receives the number of seconds to seek (positive for forward, negative for backward).
   * @param seekSeconds - Number of seconds to seek (e.g., 10, -10)
   */
  handleSeek: (seekSeconds: number) => void;
};

/**
 * PlaybackControls component that renders TV-optimized audio control interface.
 * Handles hardware remote events and provides focus management for TV navigation.
 */
export const PlaybackControls = ({
  audioRef,
  onNextTrack,
  onPreviousTrack,
  isFocused,
  handleSeek,
}: Props) => {
  const seekBackwardRef = useRef<TouchableOpacity>(null);
  const seekForwardRef = useRef<TouchableOpacity>(null);
  const playPauseRef = useRef<TouchableOpacity>(null);

  useTVEventHandler(({ eventType, eventKeyAction }: HWEvent) => {
    if (!isFocused) {
      return;
    }
    if (
      eventKeyAction === EVENT_KEY_DOWN &&
      audioRef.current?.currentTime !== 0
    ) {
      switch (eventType) {
        case RemoteEvent.SKIP_BACKWARD:
          seekBackwardRef.current?.focus();
          break;
        case RemoteEvent.SKIP_FORWARD:
          seekForwardRef.current?.focus();
          break;
        case RemoteEvent.PLAY_PAUSE:
          playPauseRef.current?.focus();
          break;
      }
    } else if (eventKeyAction === EVENT_KEY_UP) {
      switch (eventType) {
        case RemoteEvent.SKIP_BACKWARD:
        case RemoteEvent.SKIP_FORWARD:
          break;
      }
    }
  });

  /**
   * Handles blur events for hardware remote buttons.
   * Ensures proper focus state cleanup when hardware buttons are released.
   */
  const onBlur = useCallback((eventType: string) => {
    switch (eventType) {
      case RemoteEvent.SKIP_BACKWARD:
        seekBackwardRef.current?.blur();
        break;
      case RemoteEvent.SKIP_FORWARD:
        seekForwardRef.current?.blur();
        break;
      case RemoteEvent.PLAY_PAUSE:
        playPauseRef.current?.blur();
        break;
    }
  }, []);

  return (
    <TVFocusGuideView trapFocusLeft trapFocusRight>
      <View style={styles.playbackControls}>
        <PlayerButton
          onPress={onPreviousTrack}
          icon={'skip-previous'}
          size={70}
          testID={'player-btn-previous-track'}
          overrideStyle={styles.seekOverrideStyle}
        />
        <PlayerButton
          onPress={() => handleSeek(-DEFAULT_SEEK_SECONDS)}
          icon={'replay-10'}
          size={70}
          testID={'player-btn-skip-backward'}
          overrideStyle={styles.seekOverrideStyle}
          focusableElementRef={seekBackwardRef}
          onBlur={() => onBlur(RemoteEvent.SKIP_BACKWARD)}
        />
        <PlayPauseButton
          key={audioRef.current?.currentSrc || 'Initial'}
          onBlur={() => onBlur(RemoteEvent.PLAY_PAUSE)}
          focusableElementRef={playPauseRef}
          audioRef={audioRef}
        />
        <PlayerButton
          onPress={() => handleSeek(DEFAULT_SEEK_SECONDS)}
          icon={'forward-10'}
          size={70}
          testID={'player-btn-skip-forward'}
          overrideStyle={styles.seekOverrideStyle}
          focusableElementRef={seekForwardRef}
          onBlur={() => onBlur(RemoteEvent.SKIP_FORWARD)}
        />
        <PlayerButton
          onPress={onNextTrack}
          icon={'skip-next'}
          size={70}
          testID={'player-btn-next-track'}
          overrideStyle={styles.seekOverrideStyle}
        />
      </View>
    </TVFocusGuideView>
  );
};

const styles = StyleSheet.create({
  playbackControls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  seekOverrideStyle: {
    marginHorizontal: 15,
  },
});

export default PlaybackControls;
