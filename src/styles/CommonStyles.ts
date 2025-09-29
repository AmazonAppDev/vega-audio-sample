/*
 * Copyright (c) 2023 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

/**
 * Shared styles for consistent UI patterns
 */

import { StyleSheet } from 'react-native';
import { HomeSidebarWidth } from '../Constants';
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
    fontSize: 28,
    alignSelf: 'center',
    fontWeight: '500',
    marginEnd: 30,
  },

  drawerStyle: {
    backgroundColor: COLORS.DARKGREY,
    width: HomeSidebarWidth,
    alignContent: 'center',
    paddingTop: 10,
  },

  viewStyle: {
    padding: 10,
    width: 50,
    height: 50,
    marginTop: 30,
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
  },

  iconStyle: {
    width: 30,
    height: 30,
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
    shadowRadius: 10.32,
    elevation: 5,
    overflow: 'hidden',
  },

  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.DARKGREY,
    padding: 10,
  },

  listStyle: {
    marginHorizontal: 20,
  },

  titleText: {
    color: COLORS.WHITE,
    fontSize: 30,
  },

  focusStyle: {
    borderColor: COLORS.GRAY,
    borderWidth: 3,
  },
});
export default CommonStyles;
