import { SeekBar } from '@amazon-devices/kepler-ui-components';
import {
  ActivityIndicator,
  TVFocusGuideView,
} from '@amazon-devices/react-native-kepler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DEFAULT_PROGRESS_TIME, formatTime } from '../Constants';
import { COLORS } from '../styles/Colors';
import { scaleUxToDp } from '../utils/pixelUtils';

type Props = {
  totalDuration: number;
  progress: number;
  onBlur: () => void;
  onFocus: () => void;
  isFocused: boolean;
  isBuffering?: boolean;
};

/**
 * Display-only seek bar. Seeking is owned by Player.handleSeek (D-pad Left/Right
 * while this bar is focused), so the SeekBar does not step on its own (step={0})
 * and its thumb value is intentionally NOT fed back into `progress` via
 * onValueChange. Wiring onValueChange back into
 * currentValue creates a second writer for the same value and an echo loop
 * between the SeekBar's thumbValue/currentValue effects, which can re-render
 * forever and get the app killed as AppNotResponding.
 */
const AudioSeekBar = ({
  totalDuration,
  onFocus,
  onBlur,
  progress,
  isFocused,
  isBuffering,
}: Props) => {
  const renderThumbIcon = () => {
    if (isBuffering) {
      return <ActivityIndicator size={scaleUxToDp(100)} color="white" />;
    }
    return <View style={styles.thumbIconStyle} />;
  };

  return (
    <View style={styles.progressBarSection}>
      <Text style={styles.durationTime} testID="player-progress-current-time">
        {formatTime(progress || 0) || DEFAULT_PROGRESS_TIME}
      </Text>
      <TVFocusGuideView trapFocusLeft trapFocusRight style={styles.styleSeek}>
        <SeekBar
          currentValue={progress}
          // step={0}: the SeekBar must not move its own thumb on Left/Right.
          // Player.handleSeek owns D-pad seeking; a non-zero step makes the
          // thumb move 1 s and then jump to the app's 10 s seek (stutter).
          step={0}
          onFocus={onFocus}
          onBlur={onBlur}
          barStyle={isFocused ? styles.focusedSliderStyle : styles.sliderStyle}
          totalValue={totalDuration}
          currentValueIndicatorColor={COLORS.GRAY}
          thumbIcon={renderThumbIcon()}
        />
      </TVFocusGuideView>
      <Text style={styles.durationTime} testID="player-total-duration">
        {formatTime(totalDuration || 0) || DEFAULT_PROGRESS_TIME}
      </Text>
    </View>
  );
};

export default AudioSeekBar;

const styles = StyleSheet.create({
  progressBarSection: {
    flex: 0.3,
    alignItems: 'center',
    flexDirection: 'row',
  },
  durationTime: {
    color: COLORS.WHITE,
    marginHorizontal: scaleUxToDp(10),
    fontSize: scaleUxToDp(20),
  },
  sliderStyle: {
    flex: 1,
    alignSelf: 'center',
    borderRadius: scaleUxToDp(10),
  },
  focusedSliderStyle: {
    borderWidth: 1,
    opacity: 2,
    borderColor: COLORS.WHITE,
    flex: 1,
    alignSelf: 'center',
    borderRadius: scaleUxToDp(10),
  },
  thumbIconStyle: {
    width: scaleUxToDp(30),
    height: scaleUxToDp(30),
    borderRadius: scaleUxToDp(15),
    backgroundColor: COLORS.GREEN,
  },
  styleSeek: {
    flex: 1,
  },
});
