/*
 * Copyright (c) 2023 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

/**
 * Two-tier navigation architecture for TV audio applications
 * Combines permanent drawer navigation with stack modals, optimized for TV remote control
 */

import React from 'react';

// React Navigation
import { createDrawerNavigator } from '@amazon-devices/react-navigation__drawer';
import { NavigationContainer } from '@amazon-devices/react-navigation__native';
import { createStackNavigator } from '@amazon-devices/react-navigation__stack';

// Screens
import {
  AudioPlayer,
  Home,
  Library,
  PlaylistDetail,
  Search,
  Settings,
} from '../index';

// Types & styles
import styles from '../styles/CommonStyles';
import { AppStackParamList, DrawerParamList } from '../types/Types';
import { Screens } from '../utils/EnumUtils';

// Custom drawer
import NavigationItems from './NavigationItems';

const Drawer = createDrawerNavigator<DrawerParamList>();
const Stack = createStackNavigator<AppStackParamList>();

const DrawerContent = (props: any) => <NavigationItems {...props} />;

/**
 * Drawer navigation component for main app sections.
 */
const DrawerStack = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'permanent',
        drawerStyle: styles.drawerStyle,
        drawerLabelStyle: styles.labelStyle,
      }}
      drawerContent={DrawerContent}
      initialRouteName={Screens.HOME_SCREEN}
    >
      <Drawer.Screen
        name={Screens.HOME_SCREEN}
        component={Home}
        options={{ unmountOnBlur: true }}
      />
      <Drawer.Screen
        name={Screens.SEARCH_SCREEN}
        component={Search}
        options={{ unmountOnBlur: true }}
      />
      <Drawer.Screen
        name={Screens.LIBRARY_SCREEN}
        component={Library}
        options={{ unmountOnBlur: true }}
      />
      <Drawer.Screen
        name={Screens.SETTINGS_SCREEN}
        component={Settings}
        options={{ unmountOnBlur: true }}
      />
    </Drawer.Navigator>
  );
};

/**
 * Root navigation stack with independent container.
 */
const NavigationStack = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardOverlayEnabled: true,
          animationEnabled: false,
        }}
      >
        <Stack.Screen name={Screens.DRAWER_SCREEN} component={DrawerStack} />
        <Stack.Screen
          name={Screens.PLAYLIST_DETAIL_SCREEN}
          component={PlaylistDetail}
        />
        <Stack.Screen name={Screens.AUDIO_PLAYER} component={AudioPlayer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationStack;
