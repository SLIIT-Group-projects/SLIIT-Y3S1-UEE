import { StyleSheet, Text, View, Animated } from "react-native";
import React from "react";

const FormHeader = ({
  leftHeading,
  rightHeading,
  subHeading,
  leftHeaderTranslateX,
  rightHeaderTranslateY,
  rightHeaderOpacity,
}) => {
  return (
    // this is form header
    <>
      <View style={styles.container}>
        <Animated.Text
          style={[
            styles.heading,
            { transform: [{ translateX: leftHeaderTranslateX }] },
          ]}
        >
          {leftHeading}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.heading,
            {
              transform: [{ translateY: rightHeaderTranslateY }],
              opacity: rightHeaderOpacity,
            },
          ]}
        >
          {rightHeading}
        </Animated.Text>
      </View>
      <Text style={styles.subHeading}>{subHeading}</Text>
    </>
  );
};

export default FormHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1b1b33",
  },
  subHeading: {
    fontSize: 18,
    color: "#1b1b33",
    textAlign: "center",
  },
});
