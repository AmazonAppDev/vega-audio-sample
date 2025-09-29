import { SeekBar } from '@amazon-devices/kepler-ui-components';
import {
  ActivityIndicator,
  TVFocusGuideView,
} from '@amazon-devices/react-native-kepler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DEFAULT_PROGRESS_TIME, formatTime } from '../Constants';
import { COLORS } from '../styles/Colors';
import { scale } from '../utils/Scaling';

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
      return <ActivityIndicator size="small" color="white" />;
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
          disabled
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
    marginHorizontal: scale(3),
    fontSize: 15,
  },
  sliderStyle: {
    flex: 1,
    alignSelf: 'center',
    borderRadius: 10,
  },
  focusedSliderStyle: {
    borderWidth: 1,
    opacity: 2,
    borderColor: COLORS.WHITE,
    flex: 1,
    alignSelf: 'center',
    borderRadius: 10,
  },
  thumbIconStyle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.GREEN,
  },
  styleSeek: {
    flex: 1,
  },
});
