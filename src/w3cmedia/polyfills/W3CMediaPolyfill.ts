/*
 * Copyright 2022-2024 Amazon.com, Inc. or its affiliates. All rights reserved.
 *
 * AMAZON PROPRIETARY/CONFIDENTIAL
 *
 * You may not use this file except in compliance with the terms and
 * conditions set forth in the accompanying LICENSE.TXT file.
 *
 * THESE MATERIALS ARE PROVIDED ON AN "AS IS" BASIS. AMAZON SPECIFICALLY
 * DISCLAIMS, WITH RESPECT TO THESE MATERIALS, ALL WARRANTIES, EXPRESS,
 * IMPLIED, OR STATUTORY, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
 */

// @ts-nocheck
//
import {
  HTMLMediaElement,
  MediaSource,
  requestMediaKeysSystemAccess,
} from '@amazon-devices/react-native-w3cmedia';

class W3CMediaPolyfill {
  static install() {
    console.log('Installing W3CMedia polyfills');
    global.window.MediaSource = global.MediaSource = MediaSource;
    global.navigator.requestMediaKeySystemAccess = requestMediaKeysSystemAccess;
    global.HTMLMediaElement = HTMLMediaElement;
    global.Node = {};
    global.Node.TEXT_NODE = 3;
    global.Node.CDATA_SECTION_NODE = 4;
  }
}

export default W3CMediaPolyfill;
