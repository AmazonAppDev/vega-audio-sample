/*
 * Copyright (c) 2023 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
/**  * Metro configuration for React Native
 * Metro configuration
 * https://github.com/facebook/react-native
 * https://reactnative.dev/docs/metro
 *
 *
 * @format
 * @type {import('metro-config').MetroConfig}
 */

const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
