import {
  Box,
  HStack,
  Heading,
  KeyboardAvoidingView,
  Text,
  VStack,
  useToast,
} from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import { useSetRecoilState } from "recoil";

import {
  PasswordInput,
  TextButton,
  TextInput,
  StyledToast,
} from "../components/base";
import auth from "../config/firebase/auth";
import store from "../config/firebase/store";
import { kisTheme, sjajTheme } from "../config/theme/gluestack";
import { schoolThemeState } from "../stores/auth-state";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isInvalid, setIsInvalid] = useState({
    email: false,
    password: false,
  });
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const setTheme = useSetRecoilState(schoolThemeState);

  const handleSubmit = async () => {
    setLoading(true);
    const emailIsValid = /\S+@\S+\.\S+/.test(email);
    const passwordIsValid = password.length >= 7;

    if (!emailIsValid || !passwordIsValid) {
      setIsInvalid({
        email: !emailIsValid,
        password: !passwordIsValid,
      });
      return;
    }

    setIsInvalid({
      email: false,
      password: false,
    });
    try {
      const { uid } = await auth.login({ email, password });
      if (uid) {
        const user = await store.getUser(uid);

        if (user) {
          let schoolTheme;
          switch (user.school) {
            case "KIS":
              schoolTheme = kisTheme;
              break;
            case "SJAJ":
            default:
              schoolTheme = sjajTheme;
              break;
          }
          setTheme(schoolTheme);
          // setUserState(user);
          // setAuthState(uid);
        }
      }
    } catch (error) {
      let errorMessage = "Failed to log in user";
      if (error.code === "auth/invalid-login-credentials") {
        errorMessage = "Email or password is invalid";
      }
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <StyledToast
              id={id}
              title="Error!"
              description={errorMessage}
              action="error"
            />
          );
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const goToSignup = () => {
    navigation.replace("Signup");
  };

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      if (isLoading) {
        e.preventDefault();
      } else {
        navigation.dispatch(e.data.action);
      }
    });
  }, [navigation, isLoading]);

  return (
    <KeyboardAvoidingView
      flex={1}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={65}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box
          flex={1}
          width="100%"
          justifyContent="center"
          padding={30}
          paddingBottom={Platform.OS === "ios" ? 30 : 0}
        >
          <Box flex={1}>
            <Heading size="2xl">Welcome back</Heading>
            <Text>Enter your email and password</Text>
          </Box>
          <VStack space="3xl" flex={2}>
            <TextInput
              labelText="Email"
              onChangeText={setEmail}
              value={email}
              isInvalid={isInvalid.email}
              errorText="Please provide a valid email address"
              type="email"
            />
            <PasswordInput
              labelText="Password"
              onChangeText={setPassword}
              value={password}
              errorText="Atleast 7 characters required"
            />
          </VStack>
          <Box flex={0.7}>
            <TextButton
              label="Log In"
              onPress={handleSubmit}
              isLoading={isLoading}
              isDisabled={isLoading}
            />
            <HStack justifyContent="center" alignItems="center">
              <Text>Don't have an account? </Text>
              <TextButton variant="link" onPress={goToSignup} label="Signup" />
            </HStack>
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
