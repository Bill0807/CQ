import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const Skeleton = ({ containerHeight, containerWidth }) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    );

    // Start the loop
    loop.start();

    // Cleanup function to stop the loop when component unmounts
    return () => loop.stop();
  }, [animation]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-400, 200],
  });

  return (
    <View
      style={[
        styles.skeletonContainer,
        { height: containerHeight, width: containerWidth },
      ]}
    >
      <Animated.View
        style={{ ...styles.skeleton, transform: [{ translateX }] }}
      >
        <LinearGradient
          colors={["#f0f0f0", "#e2e2e2", "#f0f0f0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
        <LinearGradient
          colors={["#f0f0f0", "#e2e2e2", "#f0f0f0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    overflow: "hidden",
    borderRadius: 8,
  },
  skeleton: {
    flexDirection: "row",
    width: "200%",
    height: "100%",
  },
  gradient: {
    width: "50%",
  },
});

export default Skeleton;
