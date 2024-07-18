import {
  HStack,
  Heading,
  KeyboardAvoidingView,
  Spinner,
  Text,
  VStack,
  View,
} from "@gluestack-ui/themed";
import { Car, Pizza, Zap, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import { useRecoilValue } from "recoil";

import { StyledView, TextButton } from "../../components/base";
import IconButton from "../../components/base/IconButton";
import { ActivityForms } from "../../components/track";
import store from "../../config/firebase/store";
import { authState, userState } from "../../stores/auth-state";

function Step1({ navigation }) {
  const goToStep2 = (target) => {
    navigation.navigate("ActivityStep2", {
      target,
    });
  };

  return (
    <StyledView>
      <Text>Add Carbon Activity</Text>
      <Heading size="xl">Choose a category</Heading>
      <HStack
        justifyContent="center"
        space="3xl"
        flexWrap="wrap"
        marginTop={50}
      >
        <CategoryButton
          icon={Car}
          onPress={() => goToStep2("Transportation")}
        />
        <CategoryButton icon={Pizza} onPress={() => goToStep2("Food")} />
        <CategoryButton icon={Trash2} onPress={() => goToStep2("Waste")} />
        <CategoryButton icon={Zap} onPress={() => goToStep2("Electricity")} />
      </HStack>
    </StyledView>
  );
}

function CategoryButton({ onPress, icon }) {
  return (
    <IconButton icon={icon} width="40%" aspectRatio={1 / 1} onPress={onPress} />
  );
}

const categoryHeadingText = {
  Transportation: "How did you get to your destination?",
  Food: "What did you eat today?",
  Waste: "How much waste did you produce today?",
  Electricity: "What did you use today?",
};

function Step2({ navigation, route }) {
  const { target } = route.params;
  const [deductionAmount, setDeductionAmount] = useState(null);
  const [type, setType] = useState(null);
  const uid = useRecoilValue(authState);
  const [isLoading, setLoading] = useState(false);

  const categoryHeading = categoryHeadingText[target];

  const handleCalculate = (type, deductionAmount) => {
    setDeductionAmount(deductionAmount);
    setType(type);
  };

  const handleConfirm = async () => {
    if (!deductionAmount || !type) return;

    try {
      setLoading(true);

      const emission = {
        category: target,
        type,
        value: Number(deductionAmount),
        timestamp: Date.now(),
      };

      const updatedUser = await store.setEmission({ uid, emission });
      if (updatedUser) {
        navigation.navigate("ActivityStep3", { deductionAmount });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
    <StyledView>
      <KeyboardAvoidingView
        flex={1}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View flex={1} width="100%">
            <Text>{target}</Text>
            <Heading size="xl">{categoryHeading}</Heading>
            <ActivityForms category={target} onCalculate={handleCalculate} />
            <VStack
              flex={1}
              alignItems="center"
              justifyContent="center"
              space="sm"
            >
              {deductionAmount ? (
                <>
                  <Text>You used</Text>
                  <Heading
                    size="2xl"
                    paddingTop={Platform.OS === "android" ? 20 : 0}
                  >
                    {deductionAmount} CO
                    <Heading size="md">2</Heading>
                  </Heading>
                </>
              ) : (
                <HStack space="sm">
                  <Spinner />
                  <Text>Waiting for selection...</Text>
                </HStack>
              )}
            </VStack>
            <View flex={1}>
              <TextButton
                label="Confirm"
                onPress={handleConfirm}
                isDisabled={!deductionAmount}
                isLoading={isLoading}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </StyledView>
  );
}

function Step3({ navigation, route }) {
  const { deductionAmount } = route.params;
  const user = useRecoilValue(userState);

  const goToMain = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  };

  return (
    <StyledView justifyContent="center">
      <VStack alignItems="center" flex={0.5} justifyContent="space-between">
        <View>
          <Text size="2xl">You emitted</Text>
          <Heading size="3xl">
            {deductionAmount} kg C0<Heading size="xl">2</Heading>
          </Heading>
        </View>
        <Text>
          You have {user?.today.remainingBudget.toFixed(2)} CO
          <Text size="xs">2</Text> remaining for today
        </Text>
        <TextButton onPress={goToMain} width="80%" label="Okay" />
      </VStack>
    </StyledView>
  );
}

export default { Step1, Step2, Step3 };
