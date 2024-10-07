import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import FormContainer from "./FormContainer";
import FormInput from "./FormInput";
import FormSubmitBtn from "./FormSubmitBtn";
import client from "../api/client";
import { useNavigation } from "@react-navigation/native";

const LoginForm = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const { email, password } = userInfo;

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  const submitForm = async () => {
    try {
      const res = await client.post("/sign-in", { ...userInfo });

      if (res.data.success) {
        setUserInfo({ email: "", password: "" });
        navigation.navigate("Home");
      }
      console.log(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <FormContainer>
      <FormInput
        title="Email"
        value={email}
        onChangeText={(value) => handleOnChangeText(value, "email")}
        placeholder="JhonDoe@gmail.com"
      />
      <FormInput
        title="Password"
        value={password}
        onChangeText={(value) => handleOnChangeText(value, "password")}
      />
      <FormSubmitBtn title="Login" onPress={submitForm} />
    </FormContainer>
  );
};

export default LoginForm;

const styles = StyleSheet.create({});
