import {
  Heading,
  VStack,
  Text,
  HStack,
  KeyboardAvoidingView,
  ScrollView,
  useToast,
} from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useSetRecoilState } from "recoil";

import {
  TextButton,
  PasswordInput,
  RadioButtons,
  TextInput,
  StyledToast,
} from "../components/base";
import auth from "../config/firebase/auth";
import store from "../config/firebase/store";
import { kisTheme, sjajTheme } from "../config/theme/gluestack";
import { schoolThemeState } from "../stores/auth-state";

const schoolOptions = [
  { label: "SJAJ", value: "SJAJ" },
  { label: "KISJ", value: "KIS" },
];

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmpassword] = useState("");
  const [school, setSchool] = useState("");
  const [isInvalid, setIsInvalid] = useState({
    email: false,
    username: false,
    password: false,
    confirmPassword: false,
    school: false,
  });
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();
  const setTheme = useSetRecoilState(schoolThemeState);

  const validate = () => {
    const emailIsValid = /\S+@\S+\.\S+/.test(email);
    const usernameExists = !!username;
    const passwordIsValid = password.length > 7;
    const passwordsMatch = password === confirmPassword;
    const schoolExists = !!school;

    if (
      !emailIsValid ||
      !usernameExists ||
      !passwordIsValid ||
      !passwordsMatch ||
      !schoolExists
    ) {
      setIsInvalid({
        email: !emailIsValid,
        username: !usernameExists,
        password: !passwordIsValid,
        confirmPassword: !passwordsMatch,
        school: !schoolExists,
      });
      return false;
    }

    setIsInvalid({
      email: false,
      username: false,
      password: false,
      confirmPassword: false,
      school: false,
    });

    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const isValid = validate();

    if (!isValid) return;

    let schoolTheme;
    switch (school) {
      case "KIS":
        schoolTheme = kisTheme;
        break;
      case "SJAJ":
      default:
        schoolTheme = sjajTheme;
        break;
    }

    try {
      const { uid } = await auth.signup({ email, password });

      // if I get a `uid`, then setUser in store.
      if (uid) {
        const profile = { username, school };
        const user = await store.setUser({ uid, profile });

        if (user) {
          setTheme(schoolTheme);
          // setUserState(user);
          // setAuthState(uid);
        }
      }
    } catch (error) {
      let errorMessage = "Failed to sign up user";
      if (error.code === "auth/email-already-exists") {
        errorMessage = "Email already exists";
      }

      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <StyledToast
              id={id}
              title="Error"
              action="error"
              description={errorMessage}
            />
          );
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigation.replace("Login");
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
    <>
      <KeyboardAvoidingView
        flex={1}
        width="100%"
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={60}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 30 }}
        >
          <VStack width="100%" paddingBottom={40}>
            <Heading size="2xl">Get Started</Heading>
            <Text size="sm">Enter your credentials to create your account</Text>
          </VStack>
          <VStack flex={1} space="4xl" width="100%" paddingBottom={400}>
            <TextInput
              labelText="Username"
              onChangeText={setUsername}
              value={username}
              isInvalid={isInvalid.username}
              errorText="Please insert username"
            />
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
              isInvalid={isInvalid.password}
              errorText="Password is too short"
              helperText="At least 6 characters required"
            />
            <PasswordInput
              labelText="Confirm password"
              onChangeText={setConfirmpassword}
              value={confirmPassword}
              isInvalid={isInvalid.confirmPassword}
              errorText="Password does not match"
            />
            <RadioButtons
              options={schoolOptions}
              value={school}
              onChange={setSchool}
              isInvalid={isInvalid.school}
              labelText="Choose your school"
              errorText="Please select your school"
            />
          </VStack>
        </ScrollView>
        <VStack
          paddingTop={30}
          paddingBottom={Platform.OS === "ios" ? 30 : 0}
          paddingHorizontal={30}
        >
          <TextButton
            label="Sign Up"
            onPress={handleSubmit}
            isLoading={isLoading}
            isDisabled={isLoading}
          />
          <HStack alignItems="center" space="sm" justifyContent="center">
            <Text>Already have account?</Text>
            <TextButton label="Log In" variant="link" onPress={goToLogin} />
          </HStack>
        </VStack>
      </KeyboardAvoidingView>
    </>
  );
}
