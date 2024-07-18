import {
  HStack,
  Heading,
  KeyboardAvoidingView,
  Text,
  VStack,
  View,
} from "@gluestack-ui/themed";
import { useState } from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import { useRecoilValue } from "recoil";

import { StyledView, TextButton, TextInput } from "../../components/base";
import store from "../../config/firebase/store";
import { authState } from "../../stores/auth-state";

const MAX_VALUE = 6.4;

function Step1({ navigation }) {
  const [amount, setAmount] = useState("");
  const uid = useRecoilValue(authState);
  const [isLoading, setLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const handleConfirm = async () => {
    if (isInvalid) return;

    try {
      setLoading(true);
      await store.setBorrowTicket({ amount, uid });
      navigation.navigate("BorrowStep2", { amount });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const validateAmount = (amount) => {
    if (amount > MAX_VALUE) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
    setAmount(amount);
  };

  return (
    <StyledView>
      <KeyboardAvoidingView
        flex={1}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View flex={1} width="100%">
            <Heading size="xl">How much do you want to borrow?</Heading>
            <HStack flex={0.5} alignItems="center" type="number">
              <TextInput
                value={amount}
                onChangeText={validateAmount}
                flex={0.3}
                isInvalid={isInvalid}
                type="number"
              />
              <Text>kg CO2</Text>
            </HStack>
            <VStack flex={0} space="md">
              <Text textAlign="center">
                You can borrow max. {MAX_VALUE}, once per day
              </Text>
              <TextButton
                label="Confirm"
                onPress={handleConfirm}
                isDisabled={isInvalid || !amount}
                isLoading={isLoading}
              />
            </VStack>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </StyledView>
  );
}

function Step2({ route, navigation }) {
  const { amount } = route.params;

  const goToMain = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  };

  return (
    <StyledView justifyContent="center">
      <VStack alignItems="center" flex={0.5} justifyContent="space-between">
        <View alignItems="center">
          <Text>You requested to borrow</Text>
          <Heading size="3xl">
            {amount} kg CO<Heading size="xl">2</Heading>
          </Heading>
        </View>
        <Text textAlign="center">
          Come back to see if someone took your request
        </Text>
        <TextButton label="Okay" onPress={goToMain} width="80%" />
      </VStack>
    </StyledView>
  );
}

export default { Step1, Step2 };
