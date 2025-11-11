/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import MaterialIcons from '@amazon-devices/react-native-vector-icons/MaterialIcons';
import React, { RefObject } from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../styles/Colors';
import FocusableElement from './FocusableElement';

/**
 * Props for the PlayerButton component
 * @typedef {Object} PlayerButtonProps
 * @property {RefObject<TouchableOpacity>} [focusableElementRef] - Reference to the TouchableOpacity for manual focus control
 * @property {function} [onFocus] - Callback when button receives focus
 * @property {function} onPress - Callback when button is pressed
 * @property {function} [onBlur] - Callback when button loses focus
 * @property {string} icon - Material icon name to display
 * @property {number} size - Size of the icon in pixels
 * @property {StyleProp<ViewStyle>} [overrideStyle] - Override styles for different contexts (PlaybackControls: spacing, AlbumCarousel: appearance)
 * @property {boolean} [disable=false] - Whether the button is disabled
 * @property {string} [testID] - Test identifier for automated testing
 */
interface PlayerButtonProps {
  focusableElementRef?: RefObject<TouchableOpacity>;
  onFocus?: () => void;
  onPress: () => void;
  onBlur?: () => void;
  icon: string;
  size: number;
  overrideStyle?: StyleProp<ViewStyle>;
  disable?: boolean;
  testID?: string;
}

/**
 * PlayerButton is a reusable button component designed for audio player interfaces that supports:
 * - Material Icons with customizable size
 * - Focus management for TV/remote control navigation
 * - Style overrides for different UI contexts
 * - Automatic focus styling with green background and dynamic border radius
 * - Disabled state handling
 *
 * The component uses overrideStyle to adapt to different contexts:
 * - PlaybackControls: Adjusts horizontal spacing between control buttons
 * - AlbumCarousel: Customizes appearance with border radius, colors, and margins
 *
 * This pattern allows the same base component to be reused across different screens
 * while maintaining consistent behavior and accessibility features.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage in playback controls
 * <PlayerButton
 *   onPress={handlePlay}
 *   icon="play-arrow"
 *   size={50}
 *   overrideStyle={{ marginHorizontal: 15 }}
 * />
 *
 * // Usage in album carousel with custom styling
 * <PlayerButton
 *   onPress={handleShuffle}
 *   icon="shuffle"
 *   size={40}
 *   overrideStyle={{
 *     borderRadius: 50,
 *     backgroundColor: '#333',
 *     marginVertical: 25
 *   }}
 * />
 * ```
 */
export const PlayerButton = ({
  focusableElementRef,
  onFocus,
  onPress,
  onBlur,
  icon,
  size,
  overrideStyle,
  disable = false,
  testID,
}: PlayerButtonProps) => {
  return (
    <FocusableElement
      focusableElementRef={focusableElementRef}
      testID={testID}
      style={[styles.buttonContainer, overrideStyle]}
      disabled={disable}
      onFocusOverrideStyle={[styles.buttonFocus, { borderRadius: size }]}
      onPress={onPress}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <MaterialIcons name={icon} size={size} color={COLORS.WHITE} />
    </FocusableElement>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  button: {
    resizeMode: 'contain',
    tintColor: COLORS.WHITE,
    alignSelf: 'center',
  },

  buttonFocus: {
    backgroundColor: COLORS.GREEN,
  },
});

export default PlayerButton;
