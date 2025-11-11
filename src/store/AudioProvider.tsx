/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

/**
 * Global audio state management using React Context
 * Provides playback state, thumbnails, and song completion tracking
 */

import React, { createContext, useState } from 'react';
import { ImageSourcePropType } from 'react-native';

import { MUSIC_ICON } from '../Constants';

const data = {
  isAudioStarted: false,
  audioThumbnail: MUSIC_ICON,
  isSongEnded: false,
  setIsSongEnded: (_isSongEnded: boolean) => {},
  setIsAudioStarted: (_isStarted: boolean) => {},
  setAudioThumbnail: (_thumbnail: ImageSourcePropType) => {},
};

const AudioContext = createContext(data);

/**
 * Audio context provider for global state management
 */
const AudioProvider = ({ children }: any) => {
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const [audioThumbnail, setAudioThumbnail] =
    useState<ImageSourcePropType>(MUSIC_ICON);
  const [isSongEnded, setIsSongEnded] = useState(false);

  return (
    <AudioContext.Provider
      value={{
        isAudioStarted,
        setIsAudioStarted,
        audioThumbnail,
        setAudioThumbnail,
        setIsSongEnded,
        isSongEnded,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export { AudioProvider, AudioContext };
