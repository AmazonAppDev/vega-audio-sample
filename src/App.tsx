/*
 * Copyright (c) 2023 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL. USE IS SUBJECT TO LICENSE TERMS.
 */

import React from 'react';

import NavigationStack from './navigation/NavigationStack';
import { AudioProvider } from './store/AudioProvider';

export const App = () => {
  return (
    <AudioProvider>
      <NavigationStack />
    </AudioProvider>
  );
};
