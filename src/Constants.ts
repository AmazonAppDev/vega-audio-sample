/*
 * Copyright (c) 2023 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL. USE IS SUBJECT TO LICENSE TERMS.
 */

/**
 * Application constants and utilities
 */

import moment from 'moment';
import { Dimensions, Platform } from 'react-native';
import { isLargeScreen } from './utils/ScreenSizing';

// Layout dimensions
export const HomeSidebarWidth = Platform.isTV ? 350 : 200;

// Image asset imports
export const MUSIC_ICON = require('./assets/images/music-note.png');
export const MOVIE_CARD_PLACEHOLDER_IMAGE = require('./assets/images/placeholder.png');
export const DEFAULT_COVER_IMAGE = require('./assets/images/covers/neon-nights.webp');

// Responsive font sizes based on screen size
export const TitleFontSize = isLargeScreen ? 20 : 13;
export const HeaderFontSize = isLargeScreen ? 26 : 18;

// UI element sizes
export const SizeNavigationButtons = 40;
export const SizePlayshuffleButtons = 60;

// Layout proportions
export const CarouselHeight = isLargeScreen ? '30%' : '40%';

// Screen dimensions for layout calculations
export const dimension = Dimensions.get('window');

// Default time display format
export const DEFAULT_PROGRESS_TIME = '00:00';

// Material Design icon names
export const MaterialIcons = {
  PAUSE: 'pause',
  PLAY: 'play-arrow',
  CHEVRON_LEFT: 'chevron-left', // Left navigation arrow
  CHEVRON_RIGHT: 'chevron-right', // Right navigation arrow
  SHUFFLE: 'shuffle',
};

/** Formats milliseconds to MM:SS string, returns 0 for zero input */
export const formatTime = (ms: number) => {
  if (ms === 0) {
    return 0;
  }

  let duration = moment.duration(ms, 'milliseconds');
  let fromMinutes = Math.floor(duration.asMinutes());
  let fromSeconds = Math.floor(duration.asSeconds() - fromMinutes * 60);

  // Format as MM:SS with zero-padding
  return Math.floor(duration.asSeconds()) >= 60
    ? (fromMinutes <= 9 ? '0' + fromMinutes : fromMinutes) +
        ':' +
        (fromSeconds <= 9 ? '0' + fromSeconds : fromSeconds)
    : '00:' + (fromSeconds <= 9 ? '0' + fromSeconds : fromSeconds);
};

/** Converts seconds to MM:SS format */
export const secondsToHHMMSS = (seconds: number | string) => {
  seconds = Number(seconds);
  const min = Math.floor((seconds % 3600) / 60);
  const sec = Math.floor((seconds % 3600) % 60);

  // Format minutes and seconds with zero-padding
  const mins = min > 0 ? (min < 10 ? `0${min}:` : `${min}:`) : '00:';
  const second = sec > 0 ? (sec < 10 ? `0${sec}` : sec) : '00';
  return `${mins}${second}`;
};

// TV remote event key states
export const EVENT_KEY_DOWN = 0; // Key press event
export const EVENT_KEY_UP = 1; // Key release event

// TV remote control event types
export enum RemoteEvent {
  // Directional navigation
  UP = 'up',
  DOWN = 'down',
  RIGHT = 'right',
  LEFT = 'left',

  // Action buttons
  SELECT = 'select',
  MENU = 'menu',
  BACK = 'back',

  // Media control buttons
  PLAY_PAUSE = 'playpause',
  SKIP_BACKWARD = 'skip_backward',
  SKIP_FORWARD = 'skip_forward',

  // Page navigation
  PAGE_UP = 'page_up',
  PAGE_DOWN = 'page_down',
  PAGE_LEFT = 'page_left',
  PAGE_RIGHT = 'page_right',

  // Additional buttons
  INFO = 'info',
  MORE = 'more',
}

// Media element ready states
export enum ReadyState {
  HAVE_NOTHING = 0, // No information available
  HAVE_METADATA = 1, // Metadata loaded
  HAVE_CURRENT_DATA = 2, // Current position data available
  HAVE_FUTURE_DATA = 3, // Current and future data available
  HAVE_ENOUGH_DATA = 4, // Enough data for playing
}
