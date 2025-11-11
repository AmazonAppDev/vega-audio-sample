/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import { TVFocusGuideView } from '@amazon-devices/react-native-kepler';
import React, { memo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../styles/Colors';
import { AlbumCategory } from '../types/AudioDataTypes';
import { TilePosition } from '../utils/EnumUtils';
import AudioTile from './AudioTile';

interface AudioCarouselProps {
  heading: String;
  row?: number;
  data: AlbumCategory[];
  reportFullyDrawn?: number;
  initialColumnsToRender?: number;
  onTileFocus?: (title?: AlbumCategory) => void;
  onTileBlur?: (title?: AlbumCategory) => void;
  onTileClick: (title?: AlbumCategory) => void;
}

const AudioCarousel = ({
  data,
  heading,
  reportFullyDrawn,
  initialColumnsToRender,
  onTileFocus,
  onTileBlur,
  onTileClick,
}: AudioCarouselProps) => {
  const calculateTilePosition = (index: number) => {
    switch (index) {
      case 0:
        return TilePosition.START;
      case data.length - 1:
        return TilePosition.END;
      default:
        return TilePosition.CENTER;
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: AlbumCategory;
    index: number;
  }) => {
    return (
      <View>
        <AudioTile
          index={index}
          key={`${item.albumId} ${index}`}
          data={item}
          reportFullyDrawn={index === reportFullyDrawn ? true : false}
          onFocus={onTileFocus}
          onBlur={onTileBlur}
          tilePosition={calculateTilePosition(index)}
          onTileClick={onTileClick}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container]} nativeID="carousel-container">
      <Text style={[styles.heading]}>{heading}</Text>
      <TVFocusGuideView autoFocus>
        <FlatList
          nativeID="carousel-scroll-view"
          contentContainerStyle={styles.listContentContainer}
          horizontal={true}
          data={data}
          renderItem={renderItem}
          initialNumToRender={initialColumnsToRender}
          keyExtractor={(item, index) => `${item.albumId} ${index}`}
        />
      </TVFocusGuideView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContentContainer: {
    height: 300,
  },
  heading: {
    fontSize: 36,
    color: COLORS.LIGHT_GRAY,
  },
});

export default memo(AudioCarousel, (prev, next) => prev.data === next.data);
