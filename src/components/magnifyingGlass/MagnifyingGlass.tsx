/* eslint-disable object-curly-newline */
import React, { useState, useEffect, memo } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const MAGNIFIER_WIDTH = 200;
const MAGNIFIER_HEIGHT = 200;
const ZOOM_LEVEL = 1.5;

interface IMagnifyingGlassProps {
  src: string;
}

const MagnifyingGlass = ({ src }: IMagnifyingGlassProps) => {
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);
  const showMagnifier = useSharedValue(false);

  useEffect(() => {
    const { width, height } = Dimensions.get('window');
    setImgSize({ width, height });

    touchX.value = width / 2;
    touchY.value = height / 2;
  }, [touchX, touchY]);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = touchX.value;
      ctx.startY = touchY.value;
    },
    onActive: (event, ctx) => {
      touchX.value = ctx.startX + event.translationX;
      touchY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      showMagnifier.value = false;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: touchX.value - MAGNIFIER_WIDTH / 2 },
      { translateY: touchY.value - MAGNIFIER_HEIGHT / 2 },
    ],
  }));

  const animatedImageStyle = useAnimatedStyle(() => ({
    height: imgSize.height * ZOOM_LEVEL,
    width: imgSize.width * ZOOM_LEVEL,
    top: -(touchY.value * ZOOM_LEVEL - MAGNIFIER_HEIGHT / 2),
    left: -(touchX.value * ZOOM_LEVEL - MAGNIFIER_WIDTH / 2),
  }));

  return (
    <View style={styles.container}>
      <Image source={{ uri: src }} style={styles.image} />
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.magnifier, animatedStyle]}>
          <Animated.Image source={{ uri: src }} style={animatedImageStyle} resizeMode="cover" />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  magnifier: {
    position: 'absolute',
    width: MAGNIFIER_WIDTH,
    height: MAGNIFIER_HEIGHT,
    overflow: 'hidden',
    borderRadius: MAGNIFIER_WIDTH / 2,
    borderWidth: 5,
    borderColor: 'yellow',
  },
});

export default memo(MagnifyingGlass);
