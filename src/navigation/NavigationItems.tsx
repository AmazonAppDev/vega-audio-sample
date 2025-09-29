/*
 * Copyright (c) 2023 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL. USE IS SUBJECT TO LICENSE TERMS.
 */

import MaterialIcons from '@amazon-devices/react-native-vector-icons/MaterialIcons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@amazon-devices/react-navigation__drawer';
import React, { useContext } from 'react';
import { ColorValue, Image, View } from 'react-native';
import { AudioContext } from '../store/AudioProvider';
import { COLORS } from '../styles/Colors';
import styles from '../styles/CommonStyles';
import { Screens } from '../utils/EnumUtils';

const NavigationItems = (props: DrawerContentComponentProps) => {
  // get audio data from local state
  const { isAudioStarted, audioThumbnail } = useContext(AudioContext);

  // check which drawer item is selected
  const isFocused = (screenName: string) => {
    return (
      props.state.index ===
      props.state.routes.findIndex(e => e.name === screenName)
    );
  };

  const iconImage = (source: string, color: ColorValue, size: number) => {
    return <MaterialIcons name={source} size={size} color={color} />;
  };

  const resetToHome = () =>
    props.navigation.reset({
      index: 0,
      routes: [{ name: Screens.HOME_SCREEN }],
    });

  return (
    <DrawerContentScrollView {...props} scrollEnabled={false}>
      <DrawerItem
        focusStyle={styles.focusStyle}
        label={Screens.HOME_SCREEN}
        focused={isFocused(Screens.HOME_SCREEN)}
        activeTintColor={COLORS.WHITE}
        labelStyle={styles.labelStyle}
        inactiveTintColor={COLORS.WHITE}
        inactiveBackgroundColor={COLORS.TRANSPARENT}
        activeBackgroundColor={COLORS.BG_DRAWER_SELECTED}
        icon={({ color, size }) => iconImage('home', color, size)}
        onPress={resetToHome}
      />
      <DrawerItem
        label={Screens.SEARCH_SCREEN}
        focusStyle={styles.focusStyle}
        activeTintColor={COLORS.WHITE}
        labelStyle={styles.labelStyle}
        inactiveTintColor={COLORS.WHITE}
        inactiveBackgroundColor={COLORS.TRANSPARENT}
        activeBackgroundColor={COLORS.BG_DRAWER_SELECTED}
        icon={({ color, size }) => iconImage('search', color, size)}
        focused={isFocused(Screens.SEARCH_SCREEN)}
        onPress={() => props.navigation.navigate(Screens.SEARCH_SCREEN)}
      />
      <DrawerItem
        label={Screens.LIBRARY_SCREEN}
        focusStyle={styles.focusStyle}
        activeTintColor={COLORS.WHITE}
        labelStyle={styles.labelStyle}
        inactiveTintColor={COLORS.WHITE}
        inactiveBackgroundColor={COLORS.TRANSPARENT}
        activeBackgroundColor={COLORS.BG_DRAWER_SELECTED}
        icon={({ color, size }) => iconImage('library-music', color, size)}
        focused={isFocused(Screens.LIBRARY_SCREEN)}
        onPress={() => props.navigation.navigate(Screens.LIBRARY_SCREEN)}
      />
      <DrawerItem
        label={Screens.SETTINGS_SCREEN}
        focusStyle={styles.focusStyle}
        icon={({ color, size }) => iconImage('settings', color, size)}
        focused={isFocused(Screens.SETTINGS_SCREEN)}
        activeTintColor={COLORS.WHITE}
        labelStyle={styles.labelStyle}
        inactiveTintColor={COLORS.WHITE}
        inactiveBackgroundColor={COLORS.TRANSPARENT}
        activeBackgroundColor={COLORS.BG_DRAWER_SELECTED}
        onPress={() => props.navigation.navigate(Screens.SETTINGS_SCREEN)}
      />

      {isAudioStarted && (
        // Icon will visible only when AUDIO plays
        <View style={styles.viewStyle}>
          <Image
            source={audioThumbnail}
            style={styles.iconStyle}
            testID="drawer-audio-thumbnail"
          />
        </View>
      )}
    </DrawerContentScrollView>
  );
};
export default NavigationItems;
