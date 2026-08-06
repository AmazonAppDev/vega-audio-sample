/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL. USE IS SUBJECT TO LICENSE TERMS.
 */

import { AudioPlayer } from '@amazon-devices/react-native-w3cmedia';
import React, { RefObject, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { scaleUxToDp } from '../utils/pixelUtils';
import PlayerButton from './PlayerButton';

type Props = {
  audioRef: React.MutableRefObject<AudioPlayer | null>;
  focusableElementRef: RefObject<React.ComponentRef<
    typeof TouchableOpacity
  > | null>;
  onBlur?: () => void;
};

const PlayPauseButton = ({ audioRef, focusableElementRef, onBlur }: Props) => {
  const [playing, setPlaying] = useState(
    !audioRef.current?.paused && !audioRef.current?.ended,
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const updatePlayingState = () => setPlaying(!audio.paused && !audio.ended);

    // Attach event listeners
    audio.addEventListener('play', updatePlayingState);
    audio.addEventListener('pause', updatePlayingState);
    audio.addEventListener('ended', updatePlayingState);

    // Sync state on mount
    updatePlayingState();

    // Clean up listeners on unmount
    return () => {
      audio.removeEventListener('play', updatePlayingState);
      audio.removeEventListener('pause', updatePlayingState);
      audio.removeEventListener('ended', updatePlayingState);
    };
  }, [audioRef]);

  const togglePlayback = () => {
    if (!audioRef.current) {
      return;
    }
    playing ? audioRef.current.pause() : audioRef.current.play();
  };

  return (
    <PlayerButton
      onPress={togglePlayback}
      icon={playing ? 'pause' : 'play-arrow'}
      size={scaleUxToDp(70)}
      overrideStyle={styles.buttonStyle}
      focusableElementRef={focusableElementRef}
      onBlur={onBlur}
      testID="player-btn-play-pause"
    />
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    marginHorizontal: scaleUxToDp(15),
  },
});

export default PlayPauseButton;
