/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import { ImageSourcePropType } from '@amazon-devices/react-native-kepler';

export interface AudioCategory {
  categoryId: number;
  title: string;
  data: AlbumCategory[];
}

export interface AlbumCategory {
  categoryId: number;
  albumId: number | string;
  title: string;
  description: string;
  thumbnail: ImageSourcePropType;
  data: AlbumData;
  artist?: string;
}

export interface AlbumData {
  page: number;
  results: TrackInfo[];
}

export interface TrackInfo {
  id: number;
  title: string;
  description: string;
  duration: string;
  type: string;
  audioURL: string;
  thumbURL: ImageSourcePropType;
}
