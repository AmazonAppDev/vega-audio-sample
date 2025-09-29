/*
 * Copyright (c) 2023 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { formatTime } from '../Constants';
import { COLORS } from '../styles/Colors';
import FocusableElement from './FocusableElement';

interface TrackItemProps {
  onPress: () => void;
  title: string;
  duration: string;
}

export const TrackItem = ({ onPress, title, duration }: TrackItemProps) => {
  return (
    <FocusableElement
      style={styles.viewContainer}
      onFocusOverrideStyle={[styles.viewFocus]}
      onPress={onPress}
    >
      <Text style={styles.txtTitle}>{title}</Text>
      <Text style={styles.txtDuration}>{formatTime(parseFloat(duration))}</Text>
    </FocusableElement>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  viewFocus: {
    backgroundColor: COLORS.GREEN,
  },
  txtDuration: {
    color: COLORS.WHITE,
    fontSize: 22,
    flex: 1,
    marginStart: 10,
    fontWeight: 'bold',
  },
  txtTitle: {
    color: COLORS.WHITE,
    fontSize: 22,
    flex: 1,
    fontWeight: 'bold',
  },
});

export default TrackItem;
