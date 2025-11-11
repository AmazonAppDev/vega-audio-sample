/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import React from 'react';
import {
  Animated,
  Easing,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from 'react-native';

const borderAnimationImg: ImageSourcePropType = require('../assets/images/border-gradient.png');

interface BorderAnimatedProps {
  /**
   * style passed from GridItem to BorderAnimation
   */
  style: StyleProp<ImageStyle>;

  /**
   * animation should last for given duration ms
   */
  duration?: number;

  /**
   * animation should start after given delay ms
   */
  delay?: number;
}

// animation should last 10s
const ANIMATION_DURATION = 10000;

// animation should start after 5s of focus
const ANIMATION_DELAY = 5000;

export function BorderAnimation({
  style,
  duration = ANIMATION_DURATION,
  delay = ANIMATION_DELAY,
}: BorderAnimatedProps): JSX.Element {
  // make use of useRef to define animation value
  const rotateAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotateAnimation, duration, delay]);

  return (
    <Animated.Image
      source={borderAnimationImg}
      style={[
        style,
        {
          transform: [
            {
              rotate: rotateAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        },
      ]}
    />
  );
}
