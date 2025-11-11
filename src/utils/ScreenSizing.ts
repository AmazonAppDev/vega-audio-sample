/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

/**
 * Screen dimension utilities
 */

import { Dimensions } from 'react-native';

// Get full screen dimensions (including system UI areas)
const screenDimensions = Dimensions.get('screen');

// Export screen dimensions for layout calculations
export const screenWidth = screenDimensions.width;
export const screenHeight = screenDimensions.height;

// Large screen detection (4K+)
export const isLargeScreen: boolean = (() => {
  return screenDimensions.width > 3000; // 4K threshold
})();

// Small device detection (always false for TV focus)
export const isSmallDevice: boolean = (() => {
  // Always false - app showcases large screen layouts only
  return false;
})();
