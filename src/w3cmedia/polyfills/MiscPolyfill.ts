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
import { WebCrypto } from '@amazon-devices/react-native-w3cmedia';
import 'abort-controller/polyfill';
import { decode } from 'base-64';
import 'web-streams-polyfill/es6';
import { DOMParser } from 'xmldom';

class MiscPolyfill {
  static install() {
    console.log('Installing misc polyfills');
    global.navigator.userAgent = 'AFTCA001';
    global.window.DOMParser = DOMParser;
    global.DOMParser = DOMParser;
    global.window.fetch = fetch;
    global.window.AbortController = AbortController;
    global.AbortController = AbortController;
    global.window.addEventListener = (
      type: any,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      listener: any,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      options?: any,
    ) => {
      console.log(`adding window listener ${type}`);
    };
    global.window.console = console;
    global.window.crypto = WebCrypto;
    global.window.atob = decode;
  }
}

export default MiscPolyfill;
