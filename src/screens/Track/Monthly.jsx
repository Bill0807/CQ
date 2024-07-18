import {
  Divider,
  Heading,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  VStack,
  View,
} from "@gluestack-ui/themed";
import { useState } from "react";
import { Platform } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";

import { StyledView, TextButton, TextInput } from "../../components/base";
import TextArea from "../../components/base/TextArea";
import store from "../../config/firebase/store";
import { monthlyChallengeState } from "../../stores/app-state";
import { authState, userState } from "../../stores/auth-state";

const currentMonth = new Date().getMonth() + 1;

function Step1({ navigation }) {
  const uid = useRecoilValue(authState);
  const [user, setUser] = useRecoilState(userState);
  const [isLoading, setLoading] = useState(false);
  const [when, setWhen] = useState("");
  const [where, setWhere] = useState("");
  const [who, setWho] = useState("");
  const [learn, setLearn] = useState("");
  const [isInvalid, setIsInvalid] = useState({
    when: false,
    who: false,
    where: false,
    learn: false,
  });

  const validate = () => {
    if (!when || !where || !who || !learn) {
      setIsInvalid({
        when: !when,
        who: !who,
        where: !where,
        learn: !learn,
      });
      return false;
    } else {
      return true;
    }
  };

  const handleConfirm = async () => {
    const isValid = validate();

    if (isValid) {
      try {
        setLoading(true);
        const data = { when, who, where, learn };
        const updatedUserMonthly = await store.setMonthlyChallenge({
          uid,
          data,
        });

        if (updatedUserMonthly) {
          setUser({
            ...user,
            monthly: {
              [currentMonth]: updatedUserMonthly,
            },
          });
          navigation.navigate("MonthlyStep2");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (user.monthly[currentMonth].challenge.date) {
    return (
      <StyledView justifyContent="center" alignItems="center">
        <Text>You already did this month's challenge!</Text>
      </StyledView>
    );
  }

  return (
    <StyledView>
      <KeyboardAvoidingView
        flex={1}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={120}
      >
        <ScrollView
          contentContainerStyle={{ paddingVertical: 20 }}
          marginBottom={20}
          showsVerticalScrollIndicator={false}
        >
          <VStack flex={1} space="4xl">
            <ThisMonthChallenge />
            <Divider />
            <Heading size="xl">Add details</Heading>
            <VStack space="3xl" flex={1}>
              <TextInput
                value={when}
                onChangeText={setWhen}
                labelText="When did you do it?"
                isInvalid={isInvalid.when}
              />
              <TextInput
                value={where}
                onChangeText={setWhere}
                labelText="Where did you do it?"
                isInvalid={isInvalid.where}
              />
              <TextInput
                value={who}
                onChangeText={setWho}
                labelText="With whom did you do it with?"
                isInvalid={isInvalid.who}
              />
              <TextArea
                value={learn}
                onChangeText={setLearn}
                labelText="What did you learn from doing this activity?"
                placeholder="I learned..."
                isInvalid={isInvalid.learn}
              />
            </VStack>
          </VStack>
        </ScrollView>
        <TextButton
          label="Confirm"
          onPress={handleConfirm}
          isLoading={isLoading}
          isDisabled={isLoading}
        />
      </KeyboardAvoidingView>
    </StyledView>
  );
}

function ThisMonthChallenge() {
  const monthlyChallenge = useRecoilValue(monthlyChallengeState);
  return (
    <VStack space="md">
      <Heading size="lg">This Month's Challenge</Heading>
      <View
        minHeight={100}
        backgroundColor="$backgroundLight200"
        justifyContent="center"
        paddingVertical={5}
        paddingHorizontal={15}
        borderRadius={4}
      >
        {monthlyChallenge && (
          <VStack space="sm">
            <Text bold>{monthlyChallenge.title}</Text>
            <Text>{monthlyChallenge.description}</Text>
            <Text size="sm">Credit: {monthlyChallenge.credit}</Text>
          </VStack>
        )}
      </View>
    </VStack>
  );
}

function Step2({ route, navigation }) {
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
          <Text>Good job!</Text>
        </View>
        <TextButton label="Okay" onPress={goToMain} width="80%" />
      </VStack>
    </StyledView>
  );
}

export default { Step1, Step2 };
