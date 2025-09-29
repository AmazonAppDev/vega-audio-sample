/*
 * Copyright (c) 2023 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL. USE IS SUBJECT TO LICENSE TERMS.
 */

import React, { useCallback } from 'react';
import { View } from 'react-native';
import { AlbumCarousel } from '../components';
import { getCategoryAlbums } from '../data/client';
import CommonStyles from '../styles/CommonStyles';
import { AlbumCategory, TrackInfo } from '../types/AudioDataTypes';
import { AppStackScreenProps } from '../types/Types';
import { Screens } from '../utils/EnumUtils';

const PlaylistDetail = ({
  navigation,
  route,
}: AppStackScreenProps<Screens.PLAYLIST_DETAIL_SCREEN>) => {
  const { categoryId, albumId } = route.params;
  const albumData: AlbumCategory[] = getCategoryAlbums(categoryId);
  const selectedAlbumIndex = albumData.findIndex(
    item => item.albumId === albumId,
  );
  let index = 0;

  const navigateToAudioPlayer = (
    albumIdLocal: number | string,
    audioId?: number,
  ) => {
    const getCurrentAlbum = albumData.filter(
      data => data.albumId === albumIdLocal,
    );
    if (audioId) {
      index = getCurrentAlbum[0].data.results.findIndex(
        data => data.id === audioId,
      );
    }
    navigation.navigate(Screens.AUDIO_PLAYER, {
      albumTrackData: getCurrentAlbum[0].data.results,
      albumName: getCurrentAlbum[0].title,
      albumThumbnail: getCurrentAlbum[0].thumbnail,
      index: index,
    });
  };

  const navigateToAudio = useCallback(
    (audioInfo: TrackInfo, albumIdLocal: number | string) => {
      navigateToAudioPlayer(albumIdLocal, audioInfo.id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onPlayButtonClick = useCallback((albumIdLocal: number | string) => {
    navigateToAudioPlayer(albumIdLocal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSuffleButtonClick = useCallback(
    (albumIdLocal: number | string) => {
      const currentAlbum = albumData.filter(
        data => data.albumId === albumIdLocal,
      );
      const tracks = currentAlbum[0].data.results;
      const shuffledQueue = [...tracks].sort(() => Math.random() - 0.5);

      navigation.navigate(Screens.AUDIO_PLAYER, {
        albumTrackData: shuffledQueue,
        albumName: currentAlbum[0].title,
        albumThumbnail: currentAlbum[0].thumbnail,
        index: 0,
      });
    },
    [albumData, navigation],
  );

  return (
    <View style={CommonStyles.mainContainer}>
      {albumData.length > 0 && (
        <AlbumCarousel
          albums={albumData}
          onPress={navigateToAudio}
          onPlayClick={onPlayButtonClick}
          onShuffleClick={onSuffleButtonClick}
          disableButtons={false}
          selectedAlbumIndex={selectedAlbumIndex}
        />
      )}
    </View>
  );
};

export default PlaylistDetail;
