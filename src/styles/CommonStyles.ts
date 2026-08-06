/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

/**
 * Shared styles for consistent UI patterns
 */

import { StyleSheet } from 'react-native';
import { HomeSidebarWidth } from '../Constants';
import { scaleUxToDp } from '../utils/pixelUtils';
import { COLORS } from './Colors';

const CommonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.DARKGREY,
  },

  rowItemStyle: {
    borderColor: COLORS.WHITE,
  },

  labelStyle: {
    color: COLORS.WHITE,
    fontSize: scaleUxToDp(28),
    alignSelf: 'center',
    fontWeight: '500',
    marginEnd: scaleUxToDp(30),
  },

  drawerStyle: {
    backgroundColor: COLORS.DARKGREY,
    width: HomeSidebarWidth,
    alignContent: 'center',
    paddingTop: scaleUxToDp(10),
  },

  viewStyle: {
    padding: scaleUxToDp(10),
    width: scaleUxToDp(50),
    height: scaleUxToDp(50),
    marginTop: scaleUxToDp(30),
    alignSelf: 'center',
    borderRadius: scaleUxToDp(10),
    backgroundColor: 'white',
  },

  iconStyle: {
    width: scaleUxToDp(30),
    height: scaleUxToDp(30),
    alignSelf: 'center',
  },

  stack: {
    flex: 1,
    shadowColor: '#FFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: scaleUxToDp(10.32),
    elevation: 5,
    overflow: 'hidden',
  },

  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.DARKGREY,
    padding: scaleUxToDp(10),
  },

  listStyle: {
    marginHorizontal: scaleUxToDp(20),
  },

  titleText: {
    color: COLORS.WHITE,
    fontSize: scaleUxToDp(30),
  },

  focusStyle: {
    borderColor: COLORS.GRAY,
    borderWidth: scaleUxToDp(3),
  },
});
export default CommonStyles;
