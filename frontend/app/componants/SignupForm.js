import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import FormContainer from "./FormContainer";
import FormInput from "./FormInput";
import FormSubmitBtn from "./FormSubmitBtn";
import client from "../api/client";

import { Formik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  userName: Yup.string()
    .trim()
    .min(3, "Invalid name")
    .required("Please enter a userName"),
  email: Yup.string().email("Invalid email").required("Please enter an email"),
  password: Yup.string()
    .trim()
    .min(3, "password must be above 3 characters")
    .required("Plese enter a password"),
  confirmPassword: Yup.string().equals(
    [Yup.ref("password"), null],
    "Password does not match"
  ),
});

const isValidObject = (obj) => {
  return Object.values(obj).every((value) => value.trim());
};

const updateError = (err, stateUpdater) => {
  stateUpdater(err);
  setTimeout(() => {
    stateUpdater("");
  }, 2500);
};

const SignupForm = () => {
  const userInfo = {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [error, seterror] = useState("");
  const { userName, email, password, confirmPassword } = userInfo;

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  const isValidForm = () => {
    if (!isValidObject(userInfo))
      return updateError("Please fill all fields", seterror);
    if (password !== confirmPassword)
      return updateError(
        "password and confirm password should be same",
        seterror
      );
    return true;
  };

  const submitForm = () => {
    if (isValidForm()) {
      console.log(userInfo);
    }
  };

  const signUp = async (values, formikActions) => {
    const res = await client.post("/create-user", {
      ...values,
    });
    console.log(res.data);
    formikActions.resetForm();
    formikActions.setSubmitting(false);
  };

  return (
    <FormContainer>
      <Formik
        initialValues={userInfo}
        validationSchema={validationSchema}
        onSubmit={signUp}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => {
          const { userName, email, password, confirmPassword } = values;
          return (
            <>
              <FormInput
                value={userName}
                error={touched.userName && errors.userName}
                onChangeText={handleChange("userName")}
                title="User Name"
                onBlur={handleBlur("userName")}
                placeholder="Jhon Doe"
              />
              <FormInput
                autoCapitalize="none"
                value={email}
                error={touched.email && errors.email}
                onChangeText={handleChange("email")}
                title="Email"
                onBlur={handleBlur("email")}
                placeholder="JhonDoe@gmail.com"
              />
              <FormInput
                autoCapitalize="none"
                value={password}
                error={touched.password && errors.password}
                onChangeText={handleChange("password")}
                title="Password"
                onBlur={handleBlur("password")}
                secureTextEntry
              />
              <FormInput
                autoCapitalize="none"
                value={confirmPassword}
                error={touched.confirmPassword && errors.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                title="Confirm Password"
                onBlur={handleBlur("confirmPassword")}
                secureTextEntry
              />
              <FormSubmitBtn
                submitting={isSubmitting}
                onPress={handleSubmit}
                title="Sign up"
              />
            </>
          );
        }}
      </Formik>
    </FormContainer>
  );
};

export default SignupForm;

const styles = StyleSheet.create({});
