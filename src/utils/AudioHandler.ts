/*
 * Copyright (c) 2024 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL. USE IS SUBJECT TO LICENSE TERMS.
 */

/**
 * Core audio playback management hook
 *
 * Manages TV audio functionality:
 * - Multi-format support: MP3/MP4 via AudioPlayer, DASH/HLS via ShakaPlayer
 * - Race condition prevention during rapid track transitions
 * - Vega Media Controls integration for TV remote button handling
 * - Memory-efficient resource cleanup and state management
 * - Debounced seeking with boundary protection to prevent audio glitches
 */

import React, { useCallback, useContext, useState } from 'react';
import { ImageSourcePropType } from 'react-native';

import {
  IComponentInstance,
  IKeplerAppStateManager,
  useKeplerAppStateManager,
} from '@amazon-devices/react-native-kepler';
import { AudioPlayer } from '@amazon-devices/react-native-w3cmedia';

import { MUSIC_ICON } from '../Constants';
import { AudioContext } from '../store/AudioProvider';
import { TrackInfo } from '../types/AudioDataTypes';
import { ShakaPlayer } from '../w3cmedia/shakaplayer/ShakaPlayer';
import { AppOverrideMediaControlHandler } from './AppOverrideMediaControlHandler';

/**
 * Media file type classification for player selection
 */
export enum MediaFileTypes {
  ADAPTIVE = 'adaptive', // DASH/HLS streams requiring ShakaPlayer
  NON_ADAPTIVE = 'nonAdaptive', // Standard MP3/MP4 files using AudioPlayer
}

/**
 * Audio state management hook for loading and buffering states
 */
const useAudioState = () => {
  const [mediaType, setMediaType] = useState<MediaFileTypes>(
    MediaFileTypes.NON_ADAPTIVE,
  );

  // Loading states for UI feedback
  const [isLoading, setIsLoading] = useState(false); // Initial track loading
  const [isBuffering, setIsBuffering] = useState(false); // Seeking/buffering state

  return {
    mediaType,
    setMediaType,
    isLoading,
    setIsLoading,
    isBuffering,
    setIsBuffering,
  };
};

/**
 * Audio references management hook for player instances and timeouts
 */
const useAudioRefs = () => {
  const audioRef = React.useRef<AudioPlayer | null>(null); // Main audio player instance
  const player = React.useRef<any>(null); // ShakaPlayer instance for adaptive content
  const timeoutIdRef = React.useRef<ReturnType<typeof setTimeout> | null>(null); // Seeking debounce timeout
  const initializingRef = React.useRef<boolean>(false); // Prevents concurrent initialization

  return { audioRef, player, timeoutIdRef, initializingRef };
};

/**
 * Audio event handlers hook for lifecycle management
 */
const useAudioEvents = (
  audioRef: React.RefObject<AudioPlayer | null>,
  context: any,
  setIsLoading: (value: boolean) => void,
  thumbNailRef: React.RefObject<any>,
) => {
  /**
   * Ends current song playback with state reset
   */
  const endCurrentSong = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      context.setIsSongEnded(true);
      context.setIsAudioStarted(false);
    }
  }, [context, audioRef]);

  /**
   * Updates global state when playback begins
   */
  const onPlaying = useCallback(() => {
    context.setIsAudioStarted(true);
    context.setAudioThumbnail(thumbNailRef.current);
    context.setIsSongEnded(false);
    setIsLoading(false); // Stop loading indicator when playing starts
  }, [context, thumbNailRef, setIsLoading]);

  /**
   * Handles track completion and state transition
   */
  const onEnded = useCallback(() => {
    console.log('---onEnded---');
    context.setIsSongEnded(true);
    context.setIsAudioStarted(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [context, audioRef]);

  /**
   * Handles audio errors with fallback behavior
   */
  const onError = useCallback(() => {
    context.setAudioThumbnail(MUSIC_ICON);
    onEnded();
  }, [context, onEnded]);

  return { endCurrentSong, onPlaying, onEnded, onError };
};

/**
 * Main audio handler hook for complete playback management
 * Manages player lifecycle, state synchronization, and resource cleanup
 */
export const useAudioHandler = ({
  onTimeChange,
  onLoadedMetadata,
  onAudioInitialize,
}: {
  onTimeChange: React.Dispatch<React.SetStateAction<number>>;
  onLoadedMetadata: () => void;
  onAudioInitialize?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // State and reference management
  const audioState = useAudioState();
  const { audioRef, player, timeoutIdRef, initializingRef } = useAudioRefs();

  // Global context and track references
  const context = useContext(AudioContext);
  const audioTrackRef = React.useRef<TrackInfo | null>(null);
  const thumbNailRef = React.useRef(MUSIC_ICON);

  // Kepler Media Controls integration
  const keplerAppStateManager: IKeplerAppStateManager =
    useKeplerAppStateManager();
  const componentInstance: IComponentInstance =
    keplerAppStateManager.getComponentInstance();

  // Initialize event handlers
  const audioEvents = useAudioEvents(
    audioRef,
    context,
    audioState.setIsLoading,
    thumbNailRef,
  );

  // Event Handlers
  const onTimeUpdate = onTimeChange;
  const onAudioInitializer = onAudioInitialize;

  /**
   * Removes all audio event listeners with cleanup.
   * Prevents memory leaks during track transitions and component unmounting.
   */
  const removeEventListeners = useCallback(() => {
    if (audioRef?.current) {
      audioRef.current.removeEventListener('seeking', handleSeekingEvent);
      audioRef.current.removeEventListener('ended', audioEvents.onEnded);
      audioRef.current.removeEventListener('error', audioEvents.onError);
      audioRef.current.removeEventListener('playing', audioEvents.onPlaying);
      audioRef.current.removeEventListener('loadedmetadata', onLoadedMetadata);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Handles component unmount cleanup with global state reset.
   * Ensures proper cleanup of all audio resources and global state when component unmounts.
   */
  const onAudioUnMounted = (): void => {
    console.log('[AudioHandler.ts] - onAudioUnMounted');
    context.setIsAudioStarted(false); // Reset playback state
    context.setAudioThumbnail(MUSIC_ICON); // Reset to default thumbnail
    context.setIsSongEnded(true); // Mark as ended
    // @ts-ignore
    global.gmedia = null; // Clear global reference
    audioRef?.current?.pause(); // Stop playback
    audioRef.current = null; // Clear reference
  };

  /**
   * Audio instance cleanup with robust error handling.
   * Safely destroys both ShakaPlayer and AudioPlayer instances with proper exception handling.
   */
  const clearAudioInstance = useCallback(async () => {
    audioState.setIsBuffering(false); // Clear buffering state

    // Clean up ShakaPlayer if present
    if (player.current) {
      try {
        await player.current.unload();
      } catch (e) {
        console.error(
          '[AudioHandler.ts] - clearAudioInstance : Error unloading Shaka player:',
          e,
        );
      } finally {
        player.current = null;
      }
    }

    // Clean up AudioPlayer if present
    if (audioRef.current !== null) {
      try {
        removeEventListeners(); // Remove all event listeners
        audioRef.current.pause(); // Stop playback
        await audioRef.current.deinitialize(); // Properly deinitialize
        onAudioUnMounted(); // Reset global state
      } catch (e) {
        console.error(
          '[AudioHandler.ts] - Trying to remove listeners : Error cleaning up audio player:',
          e,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, removeEventListeners]);

  /**
   * Attaches event listeners to enable event-driven audio behavior.
   * Called during player initialization to establish all necessary audio event handling.
   */
  const setUpEventListeners = (): void => {
    if (audioRef?.current) {
      audioRef.current.addEventListener('seeking', handleSeekingEvent); // Handle seek operations
      audioRef.current.addEventListener('ended', audioEvents.onEnded); // Handle track completion
      audioRef.current.addEventListener('error', audioEvents.onError); // Handle playback errors
      audioRef.current.addEventListener('playing', audioEvents.onPlaying); // Handle playback start
      audioRef.current.addEventListener('loadedmetadata', onLoadedMetadata); // Handle metadata load
    }
  };

  /**
   * Determines optimal media type and configures appropriate player technology.
   * Analyzes track format and streaming requirements to choose between AudioPlayer and ShakaPlayer.
   *
   * @param audioInfo - Track information containing format details and streaming metadata
   */
  const setUpMediaType = (audioInfo: TrackInfo) => {
    audioTrackRef.current = audioInfo;

    // Determine player type based on audio format
    if (audioInfo.type !== 'mp3' && audioInfo.type !== 'mp4') {
      audioState.setMediaType(MediaFileTypes.ADAPTIVE); // Use ShakaPlayer for DASH/HLS
    } else {
      audioState.setMediaType(MediaFileTypes.NON_ADAPTIVE); // Use AudioPlayer for standard formats
    }
  };

  /**
   * Loads standard audio files (MP3/MP4) into AudioPlayer with optimal configuration.
   * Sets source URL and configures playback settings for manual control and TV optimization.
   */
  const loadNonAdaptiveMedia = () => {
    if (audioRef.current) {
      audioRef.current.src = audioTrackRef.current?.audioURL || ''; // Set audio source
      audioRef.current.autoplay = false; // Disable autoplay
    }
  };

  /**
   * Initializes ShakaPlayer for adaptive streaming content with proper configuration.
   * Creates new ShakaPlayer instance and loads DASH/HLS content with optimal settings.
   */
  const loadAdaptivePlayerData = () => {
    if (audioRef?.current) {
      console.log('Creating new Audio Player - Shakaplayer');
      player.current = new ShakaPlayer(audioRef.current); // Create ShakaPlayer instance
      player?.current.load(getContentData(), false); // Load adaptive content
    }
  };

  /**
   * Initializes audio player with setup and configuration.
   * Handles race condition prevention, KMC integration, and format-specific loading with robust error handling.
   *
   * This function handles::
   * 1. AudioPlayer instance creation with proper configuration
   * 2. Kepler Media Controls integration for TV remote support
   * 3. Event listener setup for lifecycle management
   * 4. Content loading based on detected media type
   * 5. Error handling and cleanup on initialization failure
   */
  const initializingPreBuffering = async () => {
    // Prevent concurrent initialization attempts
    if (initializingRef.current) {
      return;
    }

    try {
      initializingRef.current = true; // Lock initialization
      audioState.setIsLoading(true); // Show loading state

      console.log(
        '[AudioHandler.ts] - initializingPreBuffering - Creating new Audio Player',
      );

      // Create new AudioPlayer instance
      audioRef.current = new AudioPlayer();
      // @ts-ignore
      global.gmedia = audioRef.current; // Set global reference for debugging

      console.log(
        '[AudioHandler.ts] - initializingPreBuffering : initialize Audio Player :',
      );

      // Integrate with Kepler Media Controls (KMC) if available
      if (componentInstance) {
        console.log(
          '[AudioHandler.ts] - preBufferVideo - KMC :  set Media Control Focus',
        );
        await audioRef.current.setMediaControlFocus(
          componentInstance,
          new AppOverrideMediaControlHandler(
            audioRef.current as AudioPlayer,
            true,
          ),
        );
      } else {
        console.log(
          '[AudioHandler.ts] - preBufferVideo - KMC: Skipped setting KMC',
        );
      }

      // Initialize player and set up event handling
      await audioRef.current.initialize();
      setUpEventListeners();

      // Load content based on detected media type
      if (audioState.mediaType === MediaFileTypes.NON_ADAPTIVE) {
        loadNonAdaptiveMedia(); // Standard MP3/MP4 loading
      } else {
        loadAdaptivePlayerData(); // DASH/HLS loading via ShakaPlayer
      }

      // Notify caller that initialization is complete
      if (onAudioInitializer) {
        onAudioInitializer(true);
      }
    } catch (error) {
      // Handle initialization failure
      context.setIsAudioStarted(false);
    } finally {
      // Always clean up initialization state
      initializingRef.current = false;
      audioState.setIsLoading(false);
    }
  };

  /**
   * Handles seeking events with debouncing and boundary protection.
   *
   * Manages audio seeking logic with edge case handling:
   * - Near-end detection to prevent seeking past track boundaries
   * - Debouncing of rapid seek operations to prevent audio glitches
   * - Real-time buffering state management for UI feedback
   * - Automatic track completion when seeking to end boundaries
   * - Race condition prevention during concurrent seek operations
   */
  const handleSeekingEvent = useCallback(() => {
    if (!audioRef?.current) {
      return;
    }

    const durationMS = audioRef.current.duration * 1000;
    const currentTimeMS = audioRef.current.currentTime * 1000;

    // Prevent seeking in the last 10 seconds to avoid issues
    if (currentTimeMS >= durationMS - 10000) {
      return;
    }
    // Auto-end track if seeking within last 3 seconds
    else if (currentTimeMS >= durationMS - 3000) {
      audioEvents.endCurrentSong();
      return;
    }

    // Pause during seek operation
    audioRef.current.pause();
    audioState.setIsBuffering(true); // Show buffering indicator

    // Handle seek past end of track
    if (audioRef.current.currentTime >= audioRef.current.duration) {
      audioEvents.endCurrentSong();
      onTimeUpdate(0);
    } else {
      // Debounce rapid seeking with timeout
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }

      timeoutIdRef.current = setTimeout(() => {
        if (audioRef.current) {
          onTimeUpdate(audioRef.current.currentTime * 1000 || 0); // Update progress
          audioState.setIsBuffering(false); // Hide buffering
          audioRef.current.play(); // Resume playback
        }
      }, 300); // 300ms debounce delay
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioEvents.endCurrentSong, onTimeUpdate, audioState.setIsBuffering]);

  /**
   * Public API: Initializes player for a new track with complete setup.
   *
   * Handles cleanup of previous instances, player type detection, and new player setup.
   *
   * @param audioInfo - Complete track information including URL, format, and metadata
   * @param albumThumbNail - Optional album artwork override for global state
   */
  const initializePlayerInstance = async (
    audioInfo: TrackInfo,
    albumThumbNail?: ImageSourcePropType,
  ) => {
    setUpMediaType(audioInfo); // Determine player type needed

    // Set thumbnail (prefer album art over track art)
    thumbNailRef.current = albumThumbNail ? albumThumbNail : audioInfo.thumbURL;

    // Clean up existing players
    if (player.current) {
      player.current.unload(); // Unload ShakaPlayer content
    }
    if (audioRef.current) {
      await destroyAudioElements(); // Clean up AudioPlayer
    }

    // Initialize new player instance
    initializingPreBuffering();
  };

  /**
   * Public API: Handles track navigation (next/previous).
   *
   * @param audioInfo - New track information for navigation target
   */
  const onNextPreviousClick = (audioInfo: TrackInfo) => {
    initializePlayerInstance(audioInfo);
  };

  /**
   * Public API: Destroys all audio elements with resource cleanup.
   */
  const destroyAudioElements = async () => {
    return clearAudioInstance();
  };

  /**
   * Helper: Formats track data for ShakaPlayer consumption with optimal configuration.
   * Creates structured content configuration object for adaptive streaming scenarios.
   *
   * @returns Optimized content configuration object for ShakaPlayer initialization
   */
  const getContentData = () => {
    return {
      secure: false, // Non-DRM content
      uri: audioTrackRef.current?.audioURL, // Stream URL
      uhd: false, // Not ultra-high definition
    };
  };

  /**
   * Public interface returned by useAudioHandler hook.
   * Provides audio management API with all necessary controls and state for consuming components.
   */
  return {
    // Player references
    audioRef, // AudioPlayer instance reference
    player, // ShakaPlayer instance reference

    // Current state
    audioTrack: audioTrackRef.current, // Current track information
    mediaType: audioState.mediaType, // Current media type (adaptive/non-adaptive)
    thumbNail: thumbNailRef.current, // Current track thumbnail
    context, // Global audio context

    // Loading states for UI feedback
    isLoading: audioState.isLoading, // Initial loading state
    isBuffering: audioState.isBuffering, // Seeking/buffering state

    // Core API methods
    initializePlayerInstance, // Initialize new track
    onNextPreviousClick, // Handle track navigation
    destroyAudioElements, // Clean up resources
    endCurrentSong: audioEvents.endCurrentSong, // End current playback
    clearAudioInstance, // Full cleanup

    // Callback references
    onTimeChange, // Progress update callback
    onLoadedMetadata, // Metadata loaded callback
  };
};
