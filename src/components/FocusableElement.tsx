/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import React, { RefObject, useState } from 'react';
import {
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

/**
 * Props for the FocusableElement component
 * @typedef {Object} FocusableElementProps
 * @property {RefObject<TouchableOpacity>} [focusableElementRef] - Reference to the TouchableOpacity for manual focus control
 * @property {StyleProp<ViewStyle>} [onFocusOverrideStyle] - Styles applied when element is focused (e.g., background color, border)
 * @property {React.ReactNode} [children] - Child components to render inside the focusable element
 * @property {function} [onBlur] - Callback when element loses focus
 * @property {function} [onFocus] - Callback when element receives focus
 * @property {function} [onPress] - Callback when element is pressed
 * @property {string} [testID] - Test identifier for automated testing
 */
interface FocusableElementProps extends TouchableOpacityProps {
  focusableElementRef?: RefObject<TouchableOpacity>;
  onFocusOverrideStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onBlur?: () => void;
  onFocus?: () => void;
  onPress?: () => void;
  testID?: string;
}

/**
 * FocusableElement is a base wrapper component for TV/remote control navigation that provides:
 * - Automatic focus state management with visual feedback
 * - Style overrides that apply only when the element is focused
 * - Consistent focus/blur behavior across the application
 * - Integration with TV remote control events
 *
 * The onFocusOverrideStyle prop allows different components to define their own
 * focus appearance while maintaining consistent focus behavior:
 * - PlayerButton: Green background with dynamic border radius
 * - TrackItem: Green background for track selection
 * - Other focusable UI elements: Custom focus styling as needed
 *
 * This approach separates focus behavior (handled by FocusableElement) from
 * focus appearance (defined by parent components).
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage with focus styling
 * <FocusableElement
 *   onPress={handlePress}
 *   onFocusOverrideStyle={{ backgroundColor: '#00ff00' }}
 * >
 *   <Text>Focusable Content</Text>
 * </FocusableElement>
 *
 * // Usage with manual focus control
 * <FocusableElement
 *   focusableElementRef={buttonRef}
 *   onFocusOverrideStyle={[styles.focusedStyle, { borderWidth: 2 }]}
 *   onFocus={() => console.log('Focused')}
 *   onBlur={() => console.log('Blurred')}
 * >
 *   <CustomButton />
 * </FocusableElement>
 * ```
 */
export const FocusableElement = ({
  focusableElementRef,
  children,
  onPress,
  onBlur,
  onFocus,
  onFocusOverrideStyle,
  style,
  disabled,
  testID,
  ...otherProps
}: FocusableElementProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const focusHandler = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const blurHandler = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <TouchableOpacity
      ref={focusableElementRef}
      testID={testID}
      activeOpacity={disabled ? 0.5 : 1}
      onFocus={focusHandler}
      onBlur={blurHandler}
      onPress={onPress}
      style={[style, isFocused ? onFocusOverrideStyle : undefined]}
      {...otherProps}
    >
      {children}
    </TouchableOpacity>
  );
};

export default FocusableElement;
