/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import { TVFocusGuideView } from '@amazon-devices/react-native-kepler';
import { useNavigation } from '@amazon-devices/react-navigation__core';
import React, { useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  MaterialIcons,
  SizeNavigationButtons,
  SizePlayshuffleButtons,
} from '../Constants';
import { COLORS } from '../styles/Colors';
import { AlbumCategory, TrackInfo } from '../types/AudioDataTypes';
import { scale } from '../utils/Scaling';
import AlbumDetailPage from './AlbumDetailPage';
import BackButton from './BackButton';
import PlayerButton from './PlayerButton';
import TrackList from './TrackList';

export interface AlbumCarouselProps {
  albums: AlbumCategory[];
  onPress: (audioInfo: TrackInfo, albumId: number | string) => void;
  onPlayClick: (albumId: number | string) => void;
  onShuffleClick: (albumId: number | string) => void;
  disableButtons: boolean;
  selectedAlbumIndex: number;
}

const AlbumCarousel = ({
  albums,
  onPress,
  onPlayClick,
  onShuffleClick,
  disableButtons,
  selectedAlbumIndex,
}: AlbumCarouselProps) => {
  const navigation = useNavigation();
  const [currentIndex, setIndex] = useState<number>(selectedAlbumIndex || 0);
  const totalCount: number = albums.length;
  const previousButtonRef = useRef<TouchableOpacity>(null);
  const navigationDestinations: TouchableOpacity[] = previousButtonRef?.current
    ? [previousButtonRef?.current]
    : [];
  const playerButtonRef = useRef<TouchableOpacity>(null);
  const playShuffleDestinations: TouchableOpacity[] = playerButtonRef?.current
    ? [playerButtonRef?.current]
    : [];

  const onPreviousButtonPress = () => {
    if (currentIndex > 0) {
      setIndex(currentIndex - 1);
    }
  };

  const onNextButtonPress = () => {
    if (currentIndex < totalCount - 1) {
      setIndex(currentIndex + 1);
    }
  };

  const navigateBack = () => {
    //on navigation back deinitialise and remove current instances
    navigation.goBack();
    return true;
  };

  const onClick = () => {
    onPlayClick(albums[currentIndex].albumId);
  };

  const onShuffle = () => {
    onShuffleClick(albums[currentIndex].albumId);
  };
  return (
    <View style={styles.viewWidth}>
      <TVFocusGuideView autoFocus trapFocusRight>
        <BackButton onPress={navigateBack} hasTVPreferredFocus />
      </TVFocusGuideView>
      {totalCount > 1 && (
        <TVFocusGuideView
          style={styles.nextPreviousRow}
          destinations={navigationDestinations}
          trapFocusLeft
        >
          <PlayerButton
            focusableElementRef={previousButtonRef}
            onPress={onPreviousButtonPress}
            disable={currentIndex === 0}
            size={SizeNavigationButtons}
            icon={MaterialIcons.CHEVRON_LEFT}
            overrideStyle={styles.nextPrevButton}
          />
          <PlayerButton
            onPress={onNextButtonPress}
            disable={currentIndex === albums.length - 1}
            size={SizeNavigationButtons}
            icon={MaterialIcons.CHEVRON_RIGHT}
            overrideStyle={styles.nextPrevButton}
          />
        </TVFocusGuideView>
      )}
      <AlbumDetailPage albumDetail={albums[currentIndex]}>
        <TVFocusGuideView
          style={styles.buttonRow}
          destinations={playShuffleDestinations}
          trapFocusRight
        >
          <PlayerButton
            onPress={onClick}
            icon={MaterialIcons.PLAY}
            size={SizePlayshuffleButtons}
            disable={disableButtons}
            overrideStyle={styles.playButton}
            focusableElementRef={playerButtonRef}
          />
          <PlayerButton
            onPress={onShuffle}
            icon={MaterialIcons.SHUFFLE}
            size={SizePlayshuffleButtons}
            disable={disableButtons}
            overrideStyle={styles.playButton}
          />
        </TVFocusGuideView>
        <TrackList
          trackInfo={albums[currentIndex].data?.results}
          onPress={onPress}
          albumId={albums[currentIndex].albumId}
        />
      </AlbumDetailPage>
    </View>
  );
};

export const styling = (isFocused: boolean) =>
  StyleSheet.create({
    focusedBorderStyle: {
      borderColor: isFocused ? COLORS.WHITE : COLORS.DARKGREY,
    },
    focusedBgStyle: {
      backgroundColor: isFocused ? COLORS.GREEN : COLORS.GRAY,
    },
  });

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
  },
  nextPreviousRow: {
    flexDirection: 'row',
    marginBottom: scale(3),
    alignSelf: 'center',
  },
  viewWidth: {
    width: '100%',
    flex: 1,
  },
  playButton: {
    borderRadius: 50,
    marginVertical: 25,
    backgroundColor: COLORS.BG_DRAWER_SELECTED,
    marginEnd: 20,
  },
  nextPrevButton: {
    borderRadius: 40,
    backgroundColor: COLORS.BG_DRAWER_SELECTED,
    marginEnd: 20,
  },
});

export default React.memo(AlbumCarousel);
