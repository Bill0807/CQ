import { Box, VStack, Image } from "@gluestack-ui/themed";
import { StatusBar } from "expo-status-bar";

import { TextButton } from "../components/base";

export default function Start({ navigation }) {
  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleSignup = () => {
    navigation.navigate("Signup");
  };

  return (
    <Box
      flex={1}
      width="100%"
      justifyContent="center"
      alignItems="center"
      padding={50}
    >
      <Box flex={1} paddingTop={100}>
        <Image
          size="xl"
          borderRadius="$full"
          source={require("../../assets/icon_sm.png")}
          alt="logo"
        />
      </Box>
      <VStack flex={1} space="3xl" width="100%">
        <TextButton label="Log in" onPress={handleLogin} />
        <TextButton label="Sign up" onPress={handleSignup} />
      </VStack>
      <StatusBar style="dark" />
    </Box>
  );
}
