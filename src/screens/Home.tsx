/* eslint-disable react-hooks/exhaustive-deps */
/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 * PROPRIETARY/CONFIDENTIAL. USE IS SUBJECT TO LICENSE TERMS.
 */

/**
 * Home Component
 *
 * Main album browsing screen of the audio streaming that displays:
 * - A grid of album tiles with focus-based navigation
 * - Audio preview functionality when albums are focused
 * - Preview timeout management (1s delay, 10s max duration)
 * - Resource cleanup and TV platform compliance
 *
 * The component integrates with Kepler services for audio playback, app state
 * management, and TV remote control optimization.
 */

// Kepler App State Management - Handle background/foreground transitions
import {
  AppStateChange,
  IKeplerAppStateManager,
  KeplerAppStateChange,
  KeplerAppStateEvent,
  useKeplerAppStateManager,
} from '@amazon-devices/react-native-kepler';

// Navigation hooks - Track screen focus state
import { useIsFocused } from '@amazon-devices/react-navigation__core';

// React core imports
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

// UI Components
import { AlbumGrid } from '../components';

// Constants and configuration
import { ReadyState } from '../Constants';

// Data sources
import { audioCategories } from '../data/client';

// Styling
import CommonStyles from '../styles/CommonStyles';

// Type definitions
import { AlbumCategory } from '../types/AudioDataTypes';
import { AppDrawerScreenProps } from '../types/Types';

// Audio management utilities
import { useAudioHandler } from '../utils/AudioHandler';
import { Screens } from '../utils/EnumUtils';

/**
 * Album browsing screen with focus-based audio preview system for TV navigation.
 * Uses 1-second delay and 10-second timeout to prevent audio conflicts.
 */
const Home = ({ navigation }: AppDrawerScreenProps<Screens.HOME_SCREEN>) => {
  // Preview timing configuration for TV remote navigation
  const FOCUS_START_TIMEOUT = 1000; // Delay before starting preview
  const FOCUS_END_TIMEOUT = 10000; // Max preview duration
  const NAVIGATION_DELAY = 500; // Navigation delay for UI feedback

  // Component state management
  const [progress, setProgressValue] = useState(0); // Audio progress tracking
  const isFocused = useIsFocused(); // Screen focus state
  const BACKGROUND_STATE: AppStateChange = 'background';

  // Timeout tracking for preview system cleanup
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  /**
   * Clears all pending preview timeouts to prevent memory leaks and audio conflicts.
   *
   * Critical for TV navigation where users rapidly move between tiles - prevents
   * multiple preview attempts from executing simultaneously and causing audio conflicts.
   */
  const clearPendingTimeouts = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };

  /**
   * Handles successful audio metadata loading by starting preview playback.
   *
   * Only starts playback if screen is still focused - prevents audio starting
   * after user has navigated away from the Home screen.
   */
  const onLoadedMetadata = useCallback(() => {
    if (audioRef.current && isFocused) {
      audioRef.current.play();
    }
  }, []);
  // Initialize audio handler with preview-specific callbacks
  const { audioRef, destroyAudioElements, initializePlayerInstance } =
    useAudioHandler({
      onTimeChange: setProgressValue, // Track progress for timeout management
      onLoadedMetadata, // Start playback when ready
    });

  // Kepler app state management for background audio handling
  const keplerAppStateManager: IKeplerAppStateManager =
    useKeplerAppStateManager();
  const addKeplerAppStateListenerCallback = (
    eventType: KeplerAppStateEvent,
    handler: (state: KeplerAppStateChange) => void,
  ) => keplerAppStateManager.addAppStateListener(eventType, handler);

  /**
   * Auto-cleanup preview when timeout reached or screen loses focus.
   * Prevents indefinite playback and background audio.
   */
  useEffect(() => {
    if (progress >= FOCUS_END_TIMEOUT || !isFocused) {
      destroyAudioElements();
    }
  }, [progress, isFocused]);

  /**
   * Setup app state monitoring and cleanup on unmount.
   * Prevents background audio playback per TV platform guidelines.
   */
  useEffect(() => {
    const changeSubscription = addKeplerAppStateListenerCallback(
      'change',
      handleAppStateChange,
    );
    return () => {
      clearPendingTimeouts(); // Cancel any pending preview attempts
      destroyAudioElements(); // Stop current audio and cleanup resources
      changeSubscription.remove(); // Remove app state listener
    };
  }, []);

  /**
   * Additional cleanup effect for audio resources on unmount.
   * Redundant safety net to ensure no audio continues after component destruction.
   */
  useEffect(() => {
    return () => {
      destroyAudioElements();
    };
  }, []);

  /**
   * Handles app state changes for proper audio lifecycle management.
   *
   * Pauses preview when app goes to background to comply with TV platform
   * guidelines and prevent unwanted audio during app switching.
   */
  const handleAppStateChange = (nextAppState: KeplerAppStateChange): void => {
    if (!audioRef?.current?.currentTime) {
      return;
    }
    console.log('--handleAppStateChange--', nextAppState);

    // Pause preview when app backgrounded (TV platform requirement)
    if (
      nextAppState === BACKGROUND_STATE &&
      audioRef.current.currentTime > 0 &&
      !audioRef.current.paused &&
      !audioRef.current.ended &&
      audioRef.current.readyState > ReadyState.HAVE_CURRENT_DATA
    ) {
      audioRef.current.pause();
    }
  };

  /**
   * Handles album tile focus with delayed preview start.
   *
   * Sets up 1-second delay to prevent audio conflicts during rapid TV remote
   * navigation. Initializes player with first track of focused album.
   *
   * @param albumData - Album information including tracks and metadata
   */
  const onTileFocus = (albumData?: AlbumCategory) => {
    if (albumData !== undefined) {
      const timeout = setTimeout(() => {
        // Start preview with first track of focused album
        initializePlayerInstance(
          albumData?.data.results[0],
          albumData.thumbnail,
        );
      }, FOCUS_START_TIMEOUT);

      timeouts.current.push(timeout); // Track for cleanup
    }
  };

  /**
   * Handles album tile blur with immediate cleanup.
   */
  const onTileBlur = () => {
    clearPendingTimeouts(); // Cancel any pending preview attempts
    destroyAudioElements(); // Stop current preview immediately
  };

  /**
   * Navigates to album detail screen with validation and cleanup.
   *
   * Validates navigation parameters, stops preview activity, and navigates
   * with delay for TV remote feedback.
   *
   * @param albumData - Album data containing navigation parameters
   */
  const navigateToDetailsScreen = (albumData?: AlbumCategory) => {
    // Validate required navigation parameters
    if (!albumData?.categoryId || !albumData?.albumId) {
      return;
    }

    clearPendingTimeouts(); // Stop all preview activity

    // Delayed navigation provides visual feedback for TV remote interaction
    setTimeout(() => {
      navigation.navigate(Screens.PLAYLIST_DETAIL_SCREEN, {
        categoryId: albumData.categoryId,
        albumId: albumData.albumId,
      });
    }, NAVIGATION_DELAY);
  };

  return (
    <View style={CommonStyles.mainContainer}>
      <AlbumGrid
        data={audioCategories}
        initialRowsToRender={5}
        onTileFocus={onTileFocus}
        onTileBlur={onTileBlur}
        onTileClick={navigateToDetailsScreen}
      />
    </View>
  );
};

export default Home;
