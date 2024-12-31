import React, { useEffect } from 'react';
import { View, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import styles from './styles';

const HeartBeatLoader = ({ color = '#007BFF', size = 100 }) => {
  const heartScale = new Animated.Value(1);
  const loadingOpacity = new Animated.Value(1);

  useEffect(() => {
    const pulseAnimation = Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.2,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    const fadeAnimation = Animated.sequence([
      Animated.timing(loadingOpacity, {
        toValue: 0.7,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(loadingOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    const combinedAnimation = Animated.parallel([
      Animated.loop(pulseAnimation),
      Animated.loop(fadeAnimation),
    ]);

    combinedAnimation.start();

    return () => {
      combinedAnimation.stop();
    };
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: loadingOpacity,
        }
      ]}
    >
      <View style={styles.overlay} />
      <View style={styles.loaderContainer}>
        <Animated.View 
          style={[
            styles.heart,
            {
              transform: [{ scale: heartScale }],
            }
          ]}
        >
          <Svg
            width={size/2}
            height={size/2}
            viewBox="0 0 24 24"
          >
            <Path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={color}
            />
          </Svg>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default HeartBeatLoader;