/**
 * Copyright (c) 2023 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */
import 'react-native';

import { render } from '@testing-library/react-native';
import * as React from 'react';
import { View } from 'react-native';
import { App } from '../src/App';

const mockNavigator = jest.fn(({ children }) => <View>{children}</View>);

jest.mock('@amazon-devices/react-navigation__drawer', () => ({
  createDrawerNavigator: jest.fn().mockReturnValue({
    Navigator: mockNavigator,
    Screen: jest.fn(({ children }) => children),
  }),
}));

jest.mock('@amazon-devices/react-navigation__stack', () => ({
  createStackNavigator: jest.fn().mockReturnValue({
    Navigator: jest.fn(({ children }) => children),
    Screen: jest.fn(({ children }) => children),
  }),
}));

jest.mock('@amazon-devices/react-navigation__native', () => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { View } = require('react-native');
  return {
    NavigationContainer: jest.fn(({ children }) => <View>{children}</View>),
  };
});

jest.mock('@amazon-devices/react-native-w3cmedia', () => ({
  AudioPlayer: jest.fn().mockImplementation(() => ({
    initialize: jest.fn().mockResolvedValue(undefined),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    pause: jest.fn(),
    deinitialize: jest.fn().mockResolvedValue(undefined),
    setMediaControlFocus: jest.fn(),
    currentTime: 0,
  })),
  KeplerMediaControlHandler: class MockKeplerMediaControlHandler {
    handlePlay = jest.fn();
    handlePause = jest.fn();
    handleStop = jest.fn();
    handleTogglePlayPause = jest.fn();
    handleStartOver = jest.fn();
    handleFastForward = jest.fn();
    handleRewind = jest.fn();
    handleSeek = jest.fn();
  },
}));

describe('Template App Snapshot tests', () => {
  it('Initial App screen', () => {
    // prettier-ignore
    const screen = render(<App />);
    expect(screen).toMatchSnapshot();
  });
});
