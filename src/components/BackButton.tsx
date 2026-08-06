/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import MaterialIcons from '@amazon-devices/react-native-vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet } from 'react-native';
import { COLORS } from '../styles/Colors';
import { scaleUxToDp } from '../utils/pixelUtils';
import FocusableElement from './FocusableElement';

interface BackButtonProps {
  onPress: () => void;
  hasTVPreferredFocus?: boolean;
}

const BackButton = ({ onPress, hasTVPreferredFocus }: BackButtonProps) => {
  return (
    <FocusableElement
      style={styles.backButtonContainer}
      onFocusOverrideStyle={styles.backButtonFocus}
      hasTVPreferredFocus={hasTVPreferredFocus}
      onPress={onPress}
    >
      <MaterialIcons
        name={'chevron-left'}
        size={scaleUxToDp(70)}
        color={COLORS.WHITE}
      />
    </FocusableElement>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: scaleUxToDp(80),
    height: scaleUxToDp(80),
  },
  backButtonFocus: {
    backgroundColor: COLORS.GREEN,
    borderRadius: scaleUxToDp(40),
  },
});

export default BackButton;
