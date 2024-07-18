import {
  Avatar,
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
  View,
} from "@gluestack-ui/themed";
import { User } from "lucide-react-native";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { StyledView, TextButton } from "../../components/base";
import store from "../../config/firebase/store";
import { authState, userState } from "../../stores/auth-state";

// const delay = (time = 2000) => new Promise((res) => setTimeout(res, time));

function Step1({ route, navigation }) {
  const { borrowObj } = route.params;
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const uid = useRecoilValue(authState);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const updatedUser = await store.setLendingTicket({
        borrowTicketId: borrowObj.borrowTicketId,
        uid,
      });
      if (updatedUser) {
        // setUser({ ...user, updatedUser });
        navigation.navigate("LendStep2", { borrowObj });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledView>
      <Heading size="2xl">Are you sure you want to lend?</Heading>
      <HStack paddingVertical={50} alignItems="center" flex={0.5}>
        <Avatar backgroundColor="$trueGray300" size="sm">
          <Icon as={User} size="lg" />
        </Avatar>
        <Heading size="md" flex={1} paddingLeft={20}>
          {borrowObj.borrowerUsername}
        </Heading>
        <Heading size="md">{borrowObj.amount} kg</Heading>
      </HStack>
      <TextButton
        label="Confirm"
        isLoading={isLoading}
        isDisabled={isLoading}
        onPress={handleConfirm}
      />
    </StyledView>
  );
}

function Step2({ route, navigation }) {
  const { borrowObj } = route.params;
  const user = useRecoilValue(userState);

  const goToMain = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  };

  return (
    <StyledView>
      <View flex={1} justifyContent="center">
        <VStack alignItems="center" justifyContent="space-around" flex={0.8}>
          <Heading textAlign="center">
            Good job!{"\n"}You gave your friend
          </Heading>
          <Heading size="2xl">
            {borrowObj.amount} kg C0<Heading>2</Heading>
          </Heading>
          <Text textAlign="center">
            You have {user?.today.remainingBudget.toFixed(2)} {"\n"}remaining
            for today
          </Text>
          <TextButton label="Confirm" onPress={goToMain} width="80%" />
        </VStack>
      </View>
    </StyledView>
  );
}

export default { Step1, Step2 };
