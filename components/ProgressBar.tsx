import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

interface ProgressBarProps {
  size: number;
  progress: number;
  height?: number;
  textSize?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  size,
  progress,
  height = 5,
  textSize = 16,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolation = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.progressBarBackground, { width: size, height }]}>
        <Animated.View
          style={[
            styles.progressBarForeground,
            { width: widthInterpolation, height },
          ]}
        />
      </View>
      <Text style={[styles.progressText, { fontSize: textSize }]}>
        {Math.round(progress)}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBarBackground: {
    backgroundColor: '#ECEFF4',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarForeground: {
    backgroundColor: '#46BD84',
    borderRadius: 5,
  },
  progressText: {
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ProgressBar;
