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
  onValueChange: (value: number) => void;
};

const AudioSeekBar = ({
  totalDuration,
  onFocus,
  onBlur,
  progress,
  isFocused,
  isBuffering,
  onValueChange,
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
          step={1000}
          onFocus={onFocus}
          onBlur={onBlur}
          barStyle={isFocused ? styles.focusedSliderStyle : styles.sliderStyle}
          totalValue={totalDuration}
          currentValueIndicatorColor={COLORS.GRAY}
          thumbIcon={renderThumbIcon()}
          onValueChange={value => {
            onValueChange(value);
          }}
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
