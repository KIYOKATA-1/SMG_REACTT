import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import Svg, { Circle as SvgCircle } from 'react-native-svg';

interface ProgressBarProps {
  size: number;
  progress: number;
  strokeWidth?: number;
  textSize?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(SvgCircle);

const ProgressBar: React.FC<ProgressBarProps> = ({
  size,
  progress,
  strokeWidth = 5,
  textSize = 16,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <SvgCircle
          stroke="#ECEFF4"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          stroke="#46BD84"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}, ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.textWrapper}>
        <Text style={[styles.text, { fontSize: textSize }]}>
          {Math.round(progress)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  textWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ProgressBar;
