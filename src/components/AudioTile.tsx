/*
 * Copyright (c) 2023 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import React, { memo, useCallback, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { AlbumCategory } from '../types/AudioDataTypes';
import { TilePosition } from '../utils/EnumUtils';
import { BorderAnimation } from './BorderAnimation';
import FocusableElement from './FocusableElement';

const FOCUSED_TILE_SCALE = 1.1;
const DEFAULT_TILE_SCALE = 1.0;

interface AudioTileProps {
  index: number;
  data: AlbumCategory;
  reportFullyDrawn: boolean;
  onFocus?: (title?: AlbumCategory) => void;
  onBlur?: (title?: AlbumCategory) => void;
  tilePosition: TilePosition;
  onTileClick: (title?: AlbumCategory) => void;
}

const AudioTile = ({
  data,
  reportFullyDrawn,
  onFocus,
  onBlur,
  onTileClick,
  tilePosition,
}: AudioTileProps) => {
  const reportFd = () => {
    if (reportFullyDrawn) {
      //@ts-ignore
      global.performance.reportFullyDrawn();
    }
  };

  const [isFocused, setIsFocused] = useState(false);
  const styles = dynamicStyles(tilePosition);

  const onFocusHandler = useCallback(() => {
    onFocus?.(data);
    setIsFocused(true);
  }, [data, onFocus]);

  const onBlurHandler = useCallback(() => {
    onBlur?.(data);
    setIsFocused(false);
  }, [data, onBlur]);

  const onClickHandler = useCallback(() => {
    onTileClick?.(data);
  }, [data, onTileClick]);

  const animatedScale = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const scale = isFocused ? FOCUSED_TILE_SCALE : DEFAULT_TILE_SCALE;

    Animated.timing(animatedScale, {
      toValue: scale,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isFocused, animatedScale]);

  return (
    <FocusableElement
      onPress={onClickHandler}
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}
    >
      <Animated.View
        style={[
          styles.tileContainer,
          { transform: [{ scale: animatedScale }] },
        ]}
      >
        {isFocused && <BorderAnimation style={styles.animationView} />}
        <View style={styles.tileView}>
          <Image
            style={styles.tileImage}
            source={data.thumbnail}
            onLoad={reportFd}
          />
          {isFocused && <Text style={styles.albumNameStyle}>{data.title}</Text>}
        </View>
      </Animated.View>
    </FocusableElement>
  );
};

const dynamicStyles = (tilePosition: TilePosition) => {
  const isEnd = tilePosition === TilePosition.END;
  const marginLeft = isEnd ? 11 : 22;
  const marginRight = isEnd ? 22 : 11;

  return StyleSheet.create({
    tileContainer: {
      width: 240,
      borderRadius: 12,
      marginRight: marginRight,
      marginLeft: marginLeft,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 18,
    },
    tileView: {
      height: '93%',
      width: '93%',
    },
    tileImage: {
      height: '100%',
      width: '100%',
      alignSelf: 'center',
      borderRadius: 5,
    },
    animationView: {
      height: 400,
      width: 400,
      position: 'absolute',
    },
    albumNameStyle: {
      alignSelf: 'center',
      position: 'absolute',
      color: 'white',
      fontSize: 18,
      bottom: 10,
      fontWeight: '500',
    },
  });
};

export default memo(AudioTile, (prev, next) => prev.data === next.data);
