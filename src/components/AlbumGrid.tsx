/*
 * Copyright (c) 2023 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL. USE IS SUBJECT TO LICENSE TERMS.
 */

import { TVFocusGuideView } from '@amazon-devices/react-native-kepler';
import React, { memo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { AlbumCategory, AudioCategory } from '../types/AudioDataTypes';
import AudioCarousel from './AudioCarousel';

interface AlbumGridProps {
  data: AudioCategory[];
  initialRowsToRender?: number;
  initialColumnsToRender?: number;
  onTileFocus?: (title?: AlbumCategory) => void;
  onTileBlur?: (title?: AlbumCategory) => void;
  onTileClick: (title?: AlbumCategory) => void;
}

const AlbumGrid = ({
  data,
  initialRowsToRender,
  initialColumnsToRender,
  onTileFocus,
  onTileBlur,
  onTileClick,
}: AlbumGridProps) => {
  const renderItem = ({
    item,
    index,
  }: {
    item: { title: string; data: AlbumCategory[] };
    index: number;
  }) => {
    return (
      <AudioCarousel
        heading={item.title}
        data={item.data}
        row={index}
        initialColumnsToRender={initialColumnsToRender}
        onTileFocus={onTileFocus}
        onTileBlur={onTileBlur}
        onTileClick={onTileClick}
      />
    );
  };

  return (
    <TVFocusGuideView style={styles.container}>
      <FlatList
        nativeID="scroll-view"
        keyExtractor={item => item.title}
        data={data}
        style={styles.container}
        contentInset={styles.contentInset}
        initialNumToRender={initialRowsToRender}
        renderItem={renderItem}
      />
    </TVFocusGuideView>
  );
};

export default memo(AlbumGrid, (prev, next) => prev.data === next.data);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentInset: {
    right: 20,
    top: 20,
    left: 20,
    bottom: 20,
  },
});
