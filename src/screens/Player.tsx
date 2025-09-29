/*
 * Copyright (c) 2023 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL. USE IS SUBJECT TO LICENSE TERMS.
 */
/**
 * Full-screen audio player optimized for TV remote control
 *
 * Addresses TV platform requirements:
 * - Race condition prevention for rapid remote button presses
 * - Hardware media button integration via Vega Media Controls
 * - Automatic track progression with boundary handling
 * - Background/foreground state management for audio lifecycle
 * - Memory-efficient progress tracking to prevent TV performance issues
 */

import {
  AppStateStatus,
  HWEvent,
  IKeplerAppStateManager,
  KeplerAppStateChangeData,
  KeplerAppStateEvent,
  useKeplerAppStateManager,
  useTVEventHandler,
} from '@amazon-devices//react-native-kepler';
import {
  useFocusEffect,
  useIsFocused,
} from '@amazon-devices/react-navigation__core';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  BackHandler,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AudioSeekBar from '../components/AudioSeekBar';
import BackButton from '../components/BackButton';
import PlaybackControls from '../components/PlaybackControls';
import { EVENT_KEY_DOWN, ReadyState, RemoteEvent } from '../Constants';
import { AudioContext } from '../store/AudioProvider';
import { COLORS } from '../styles/Colors';
import { TrackInfo } from '../types/AudioDataTypes';
import { AppStackScreenProps } from '../types/Types';
import { useAudioHandler } from '../utils/AudioHandler';
import { Screens } from '../utils/EnumUtils';
import { moderateScale, scale } from '../utils/Scaling';

// Player configuration constants
const UPDATE_PROGRESS_DELAY = 1000; // Progress update interval (ms)
const TIME_IN_SECONDS = 1000; // Milliseconds to seconds conversion
const TRACK_ART_SIZE = 90; // Album artwork size
export const DEFAULT_SEEK_SECONDS = 10; // Default seek jump duration

/**
 * Full-screen audio player with track navigation and TV remote support
 */
const Player = ({
  navigation,
  route,
}: AppStackScreenProps<Screens.AUDIO_PLAYER>) => {
  const isFocused = useIsFocused();
  // Extract route parameters for album and track data
  const { albumTrackData, index, albumName, albumThumbnail } = route.params;
  // Current track state management
  const [audioInfo, setAudioInfo] = useState<TrackInfo>(
    albumTrackData[index || 0],
  );
  const [nextContent, setNextContent] = useState({ index: index || 0 });
  const nextContentRef = useRef<number>(index || 0);
  const isAdvancingTrack = useRef(false); // Prevents double-navigation when user rapidly presses next/prev

  // UI state management
  const [ref, setRef] = useState(false); // Audio player initialization status
  const [seekFocused, setSeekFocused] = useState(false); // Seek bar focus state

  // Progress tracking
  const [progress, setProgressValue] = useState(0);
  const progressResetRef = useRef<boolean>(false); // Prevents auto-advance during track transitions

  const lastIndex = albumTrackData.length - 1; // Last track index for boundary checks

  // Audio context and app state management
  const context = useContext(AudioContext);
  const BACKGROUND_STATE: AppStateStatus = 'background';
  const keplerAppStateManager: IKeplerAppStateManager =
    useKeplerAppStateManager();
  const addKeplerAppStateListenerCallback = (
    eventType: KeplerAppStateEvent,
    handler: (state: KeplerAppStateChangeData) => void,
  ) => keplerAppStateManager.addAppStateListener(eventType, handler);

  /**
   * Starts playback when metadata finishes loading
   */
  const onLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      audioRef.current?.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize audio handler with callbacks
  const {
    audioRef, // Reference to audio player instance
    isBuffering, // Buffering state for UI feedback
    initializePlayerInstance, // Initialize new track
    endCurrentSong, // End current playback
    onNextPreviousClick, // Handle track navigation
  } = useAudioHandler({
    onTimeChange: setProgressValue, // Progress update callback
    onLoadedMetadata, // Metadata loaded callback
    onAudioInitialize: setRef, // Player initialization callback
  });

  useEffect(() => {
    //initialize audio player and pass audio data
    initializePlayerInstance(audioInfo, albumThumbnail);

    const changeSubscription = addKeplerAppStateListenerCallback(
      'change',
      handleAppStateChange,
    );

    return () => {
      context.setIsAudioStarted(false);
      changeSubscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**
   * Navigates back with audio resource cleanup
   */
  const navigateBack = useCallback(async () => {
    // Clean up audio resources before navigation
    await audioRef.current?.deinitialize();
    navigation.goBack();
    return true;
  }, [navigation, audioRef]);

  /**
   * Advances to next track or exits at album end
   */
  const onNextTrack = useCallback(() => {
    if (isAdvancingTrack.current) {
      return;
    }
    isAdvancingTrack.current = true;

    if (nextContent.index < lastIndex) {
      endCurrentSong();
      const newIndex = nextContent.index + 1;
      setNextContent({ index: newIndex });
      setAudioInfo(albumTrackData[newIndex]);
      progressResetRef.current = true;
      setProgressValue(0);
      setTimeout(() => {
        progressResetRef.current = false;
        isAdvancingTrack.current = false;
      }, 300);
    } else {
      isAdvancingTrack.current = false;
      navigateBack();
    }
  }, [
    albumTrackData,
    endCurrentSong,
    lastIndex,
    navigateBack,
    nextContent.index,
  ]);

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        const currentTime = audioRef.current.currentTime * TIME_IN_SECONDS;
        const duration = audioRef.current.duration * TIME_IN_SECONDS;

        if (progress >= duration && !progressResetRef.current) {
          endCurrentSong();
          onNextTrack();
          setProgressValue(0);
          return;
        }

        // Only update if there is a significant change to avoid unnecessary renders
        if (Math.abs(currentTime - progress) > 1) {
          setProgressValue(currentTime);
        }
      }
    };

    const interval = setInterval(updateProgress, UPDATE_PROGRESS_DELAY);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioRef.current, progress]);

  const handleAppStateChange = (
    nextAppState: KeplerAppStateChangeData,
  ): void => {
    if (!audioRef?.current?.currentTime) {
      return;
    }
    if (
      nextAppState === BACKGROUND_STATE &&
      audioRef.current.currentTime > 0 &&
      !audioRef.current.paused &&
      !audioRef.current.ended &&
      audioRef.current.readyState > ReadyState.HAVE_CURRENT_DATA
    ) {
      audioRef.current?.pause();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const backHandlerCallback = () => {
        navigateBack();
        return true;
      };

      if (Platform.isTV) {
        BackHandler.addEventListener('hardwareBackPress', backHandlerCallback);
      }

      return () => {
        if (Platform.isTV) {
          BackHandler.removeEventListener(
            'hardwareBackPress',
            backHandlerCallback,
          );
        }
      };
    }, [navigateBack]),
  );

  // handles click of previous button
  const onPreviousTrack = useCallback(() => {
    if (isAdvancingTrack.current) {
      return;
    }
    isAdvancingTrack.current = true;

    // Move to previous track or exit if at beginning
    if (nextContent.index > 0) {
      endCurrentSong();
      const newIndex = nextContent.index - 1;
      setNextContent({ index: newIndex });
      setAudioInfo(albumTrackData[newIndex]);
      progressResetRef.current = true;
      setProgressValue(0);
      setTimeout(() => {
        progressResetRef.current = false;
        isAdvancingTrack.current = false;
      }, 300);
    } else {
      isAdvancingTrack.current = false;
      navigateBack(); // Exit player when at first track
    }
  }, [albumTrackData, endCurrentSong, navigateBack, nextContent.index]);

  useEffect(() => {
    if (context.isSongEnded && progress > 0) {
      audioRef?.current?.pause();
      setProgressValue(0);
      onNextTrack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.isSongEnded]);

  useEffect(() => {
    // on change of track re-initialise the instance
    if (nextContent.index !== nextContentRef.current) {
      nextContentRef.current = nextContent.index;
      setAudioInfo(albumTrackData[nextContent.index]);
      onNextPreviousClick(albumTrackData[nextContent.index]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextContent]);

  const handleSeek = useCallback(
    (seekSeconds: number) => {
      if (isAdvancingTrack.current) {
        return;
      }

      if (typeof audioRef?.current?.currentTime === 'number') {
        const { currentTime, duration } = audioRef.current;
        const bufferTime = 1000; // 1 seconds buffer

        // Prevent seeking if within the first 3 seconds
        if (currentTime < bufferTime / TIME_IN_SECONDS) {
          return;
        }

        // Calculate new time
        const newTime = currentTime + seekSeconds;

        // Ensure newTime is within valid range
        if (newTime >= duration) {
          if (nextContent.index < lastIndex) {
            // End current song and move to next track
            endCurrentSong();
            const newIndex = nextContent.index + 1;
            setNextContent({ index: newIndex });
            setAudioInfo(albumTrackData[newIndex]);
            // Reset progress to prevent updateProgress from triggering onNextTrack
            progressResetRef.current = true;
            setProgressValue(0);
            // Reset the flag after a short delay
            setTimeout(() => {
              progressResetRef.current = false;
            }, 100);
            // Don't call onNextPreviousClick here as it will be called by the useEffect
          } else {
            // If it's the last track, just pause at the end
            audioRef.current.currentTime = duration;
            audioRef.current.pause();
            navigateBack();
          }
          return;
        }

        // Update currentTime only if newTime is valid
        if (newTime >= 0) {
          audioRef.current.currentTime = newTime;
        }
      }
    },
    [
      albumTrackData,
      audioRef,
      navigateBack,
      nextContent.index,
      endCurrentSong,
      lastIndex,
    ],
  );

  // Handle TV remote left/right arrows for seeking when seek bar is focused
  // This provides direct hardware integration beyond standard media buttons
  useTVEventHandler((evt: HWEvent) => {
    if (!Platform.isTV || !isFocused) {
      return;
    }
    if (evt && evt.eventKeyAction === EVENT_KEY_DOWN && seekFocused) {
      if (evt.eventType === RemoteEvent.LEFT) {
        handleSeek(-DEFAULT_SEEK_SECONDS);
      } else if (evt.eventType === RemoteEvent.RIGHT && progress > 0) {
        handleSeek(DEFAULT_SEEK_SECONDS);
      }
    }
  });

  return (
    <View style={styles.mainContainer}>
      <BackButton onPress={navigateBack} hasTVPreferredFocus />
      {audioInfo && (
        <View style={styles.playerMainView}>
          <View style={styles.topSection}>
            <Image style={styles.trackArt} source={albumThumbnail} />
            <Text style={styles.trackTitle}>{audioInfo.title}</Text>
            {albumName && <Text style={styles.albumName}>{albumName}</Text>}
          </View>
          {ref && (
            <>
              <AudioSeekBar
                key={`${audioInfo.title}-${audioInfo.id}`}
                totalDuration={
                  audioRef.current && audioRef.current.duration
                    ? audioRef.current.duration * 1000
                    : 0
                }
                progress={progress}
                onFocus={() => setSeekFocused(true)}
                onBlur={() => setSeekFocused(false)}
                isFocused={seekFocused}
                isBuffering={isBuffering}
                onValueChange={setProgressValue}
              />

              <PlaybackControls
                audioRef={audioRef}
                onNextTrack={onNextTrack}
                onPreviousTrack={onPreviousTrack}
                isFocused
                handleSeek={handleSeek}
              />
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default React.memo(Player, (prev, next) => prev.route === next.route);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.DARKGREY,
    padding: scale(5),
  },
  playerMainView: {
    flex: 1,
  },
  topSection: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: scale(5),
  },
  trackArt: {
    borderRadius: moderateScale(TRACK_ART_SIZE / 2),
    width: moderateScale(TRACK_ART_SIZE),
    height: moderateScale(TRACK_ART_SIZE),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.WHITE,
    borderWidth: 2,
    marginBottom: 30,
  },
  trackTitle: {
    fontSize: scale(10),
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginTop: 20,
  },
  albumName: {
    fontSize: scale(5),
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginTop: 10,
  },
});
