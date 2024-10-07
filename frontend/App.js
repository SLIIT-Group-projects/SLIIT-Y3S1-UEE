import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  View,
  Animated,
} from "react-native";
import FormHeader from "./app/componants/FormHeader";
import FormSelectorBtn from "./app/componants/FormSelectorBtn";
import LoginForm from "./app/componants/LoginForm";
import SignupForm from "./app/componants/SignupForm";
import { useEffect, useRef } from "react";
import axios from "axios";

const { width } = Dimensions.get("window");

export default function App() {
  const animation = useRef(new Animated.Value(0)).current;
  const scrollView = useRef();

  const fetchApi = async () => {
    const res = await axios.get("http://192.168.8.189:8000/");
    console.log(res.data);
  };

  useEffect(() => {
    fetchApi();
  }, []);

  // Animations for headings
  const leftHeaderTranslateX = animation.interpolate({
    inputRange: [0, width],
    outputRange: [0, 40], // Moves left as user scrolls
  });

  const rightHeaderTranslateY = animation.interpolate({
    inputRange: [0, width],
    outputRange: [0, -50], // Moves up as user scrolls
  });

  const rightHeaderOpacity = animation.interpolate({
    inputRange: [0, width],
    outputRange: [1, 0], // Fades out as user scrolls
  });
  const loginBtnColor = animation.interpolate({
    inputRange: [0, width],
    outputRange: ["rgba(27, 27, 51, 1)", "rgba(27, 27, 51, 0.4)"],
  });
  const signupBtnColor = animation.interpolate({
    inputRange: [0, width],
    outputRange: ["rgba(27, 27, 51, 0.4)", "rgba(27, 27, 51, 1)"],
  });

  return (
    <View style={{ paddingTop: 120, flex: 1 }}>
      <View style={{ height: 100 }}>
        <FormHeader
          leftHeading="Welcome "
          rightHeading="Back"
          subHeading="Natura"
          leftHeaderTranslateX={leftHeaderTranslateX}
          rightHeaderTranslateY={rightHeaderTranslateY}
          rightHeaderOpacity={rightHeaderOpacity}
        />
      </View>

      <View style={{ flexDirection: "row", padding: 20 }}>
        <FormSelectorBtn
          title="Login"
          backgroundColor={loginBtnColor}
          onPress={() => scrollView.current.scrollTo({ x: 0 })}
        />
        <FormSelectorBtn
          title="Signup"
          backgroundColor={signupBtnColor}
          onPress={() => scrollView.current.scrollTo({ x: width })}
        />
      </View>

      <ScrollView
        ref={scrollView}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: animation } } }],
          { useNativeDriver: false }
        )}
      >
        <LoginForm />
        <ScrollView>
          <SignupForm />
        </ScrollView>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: Dimensions.get("window").width,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 50 }}>Sign Up</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
