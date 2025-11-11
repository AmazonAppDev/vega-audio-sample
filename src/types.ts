/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

export interface MovieInfo {
  id: number;
  title: string;
  description: string;
  duration: number;
  thumbURL: string;
  imgURL: string;
  categories: string[];
  channel_id: number;
  audioURL: string;
}
export interface AudioCategory {
  title: string;
  data: any;
  categoryId: number;
}
export interface AlbumCategory {
  title: string;
  data: any;
  thumbnail?: string;
  albumId: number | string;
  categoryId: number;
}
