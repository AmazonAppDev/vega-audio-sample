/*
 * Copyright (c) 2023 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

/**
 * AlbumDetailPage Component
 *
 * Displays album information with a hero-style layout featuring the album artwork as
 * background. Acts as a container for playback controls and track listings on TV screens.
 *
 * Key Features:
 * - Full-width album artwork background with cover resize mode
 * - Semi-transparent black overlay
 * - Bordered album thumbnail
 * - Responsive text sizing optimized for TV viewing distances
 * - Flexible children container for TVFocusGuideView and interactive controls
 * - TV-optimized layout with proper spacing and focus management
 *
 * Common Use Cases:
 * - Album detail screens with playback controls
 * - Music browsing interfaces
 * - Album showcase with track listings
 * - TV-optimized music player layouts
 *
 * Example Usage:
 * ```tsx
 * <AlbumDetailPage albumDetail={albums[currentIndex]}>
 *   <TVFocusGuideView trapFocusRight>
 *     <PlayerButton onPress={onClick} icon="play" />
 *     <PlayerButton onPress={onShuffle} icon="shuffle" />
 *   </TVFocusGuideView>
 *   <TrackList trackInfo={albums[currentIndex].data.results} />
 * </AlbumDetailPage>
 * ```
 */

import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';

import { CarouselHeight, dimension } from '../Constants';
import { COLORS } from '../styles/Colors';
import { AlbumCategory } from '../types/AudioDataTypes';
import { scale } from '../utils/Scaling';

/** Props for the AlbumDetailPage component */
interface AlbumDetailPageProps {
  /**
   * Album data containing title, description, and thumbnail image.
   */
  albumDetail: AlbumCategory;

  /**
   * Child components rendered below the hero section.
   * Typically contains TVFocusGuideView with PlayerButtons and TrackList.
   */
  children?: any;
}

/**
 * AlbumDetailPage component that renders a hero-style album display with children container.
 * Serves as the base layout for album screens with playback controls.
 */
export const AlbumDetailPage = ({
  albumDetail,
  children,
}: AlbumDetailPageProps) => {
  return (
    <View style={styles.list}>
      <View style={styles.page}>
        <ImageBackground
          resizeMode="cover"
          style={styles.coverImage}
          source={albumDetail.thumbnail}
        >
          <View style={styles.centerRow}>
            <View style={styles.albumDetailRow}>
              <Image
                style={styles.albumThumbImage}
                source={albumDetail.thumbnail}
              />
            </View>
            <View style={styles.startMargin}>
              <Text style={styles.albumTextStyle}>{albumDetail.title}</Text>
              <Text style={styles.albumDescStyle}>
                {albumDetail.description}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  page: {
    width: dimension.width,
    height: CarouselHeight,
  },
  coverImage: {
    height: '100%',
    justifyContent: 'center',
  },
  centerRow: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BLACK_OPACITY,
  },
  albumDetailRow: {
    height: 210,
    width: 210,
    borderColor: COLORS.WHITE,
    borderWidth: 2,
    marginStart: 15,
  },
  albumThumbImage: {
    height: '100%',
    width: '100%',
    padding: 5,
  },
  startMargin: {
    paddingHorizontal: 30,
    flex: 0.7,
  },
  albumTextStyle: {
    color: COLORS.WHITE,
    fontSize: scale(10),
    fontWeight: 'bold',
  },
  albumDescStyle: {
    color: COLORS.WHITE,
    fontSize: 22,
    fontWeight: 'bold',
    marginStart: 5,
  },
});

export default AlbumDetailPage;
