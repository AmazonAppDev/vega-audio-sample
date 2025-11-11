/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL. USE IS SUBJECT TO LICENSE TERMS.
 */

import { DrawerScreenProps } from '@amazon-devices/react-navigation__drawer';
import { CompositeScreenProps } from '@amazon-devices/react-navigation__native';
import {
  StackNavigationProp,
  StackScreenProps,
} from '@amazon-devices/react-navigation__stack';
import { ImageSourcePropType } from 'react-native';
import { Screens } from '../utils/EnumUtils';
import { TrackInfo } from './AudioDataTypes';

export type AppStackParamList = {
  [Screens.HOME_SCREEN]: undefined;
  [Screens.DRAWER_SCREEN]: undefined;
  [Screens.PLAYLIST_SCREEN]: undefined;
  [Screens.PLAYLIST_DETAIL_SCREEN]: {
    categoryId: number;
    albumId: number | string;
  };
  [Screens.AUDIO_PLAYER]: {
    albumTrackData: TrackInfo[];
    index: number;
    albumName: string;
    albumThumbnail: ImageSourcePropType;
  };
};

export type DrawerParamList = {
  [Screens.HOME_SCREEN]: undefined;
  [Screens.SEARCH_SCREEN]: undefined;
  [Screens.LIBRARY_SCREEN]: undefined;
  [Screens.SETTINGS_SCREEN]: undefined;
};

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  StackScreenProps<AppStackParamList, T>;

export type AppDrawerScreenProps<T extends keyof DrawerParamList> =
  CompositeScreenProps<
    DrawerScreenProps<DrawerParamList, T>,
    StackScreenProps<AppStackParamList>
  >;

export type HomeScreenNavigationProps = StackNavigationProp<
  AppStackParamList,
  Screens.HOME_SCREEN
>;
