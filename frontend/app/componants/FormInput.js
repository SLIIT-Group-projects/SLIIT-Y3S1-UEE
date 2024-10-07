import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";

const FormInput = (props) => {
  const { placeholder, title, error } = props;

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <Text>{title}</Text>
        {error ? (
          <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
        ) : null}
      </View>

      <TextInput {...props} placeholder={placeholder} style={styles.textBox} />
    </>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  textBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1b1b33",
    height: 35,
    fontSize: 16,
    paddingLeft: 10,
    marginBottom: 20,
  },
});
