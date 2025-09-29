/*
 * Copyright (c) 2023 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import { TVFocusGuideView } from '@amazon-devices/react-native-kepler';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { dimension, HomeSidebarWidth } from '../Constants';
import { TrackInfo } from '../types/AudioDataTypes';
import { TrackItem } from './TrackItem';

interface TrackListProps {
  trackInfo: TrackInfo[];
  albumId: string | number;
  onPress: (audioInfo: TrackInfo, albumId: number | string) => void;
}

export const TrackList = ({ trackInfo, albumId, onPress }: TrackListProps) => {
  const renderTrackListItem = ({ item }: { item: TrackInfo }) => {
    return (
      <TrackItem
        onPress={() => onPress(item, albumId)}
        title={item.title}
        duration={item.duration}
      />
    );
  };

  return (
    <TVFocusGuideView autoFocus trapFocusRight style={styles.list}>
      <FlatList
        data={trackInfo}
        contentContainerStyle={styles.contentContainerStyle}
        style={styles.list}
        renderItem={renderTrackListItem}
      />
    </TVFocusGuideView>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    width: dimension.width - HomeSidebarWidth,
  },
  list: {
    flex: 1,
  },
});

export default TrackList;
