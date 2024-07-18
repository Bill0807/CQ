import {
  View,
  Text,
  Heading,
  HStack,
  VStack,
  Avatar,
  Icon,
  Button,
  ButtonText,
  ScrollView,
  Spinner,
  Center,
  useToast,
} from "@gluestack-ui/themed";
import { createStackNavigator } from "@react-navigation/stack";
import { User } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import Borrow from "./Borrow";
import Lend from "./Lend";
import { StyledToast, StyledView, TextButton } from "../../components/base";
import store from "../../config/firebase/store";
import useUserDocumentListener from "../../hooks/useUserDocumentListener";
import { authState } from "../../stores/auth-state";
import { timeAgo } from "../../utils/helpers";

export default function TradeScreens() {
  const TradeStack = createStackNavigator();

  return (
    <TradeStack.Navigator
      screenOptions={{ headerTitle: "Trade", headerBackTitle: "back" }}
      initialRouteName="Main"
    >
      <TradeStack.Screen name="Main" component={MainScreen} />
      <TradeStack.Screen name="BorrowStep1" component={Borrow.Step1} />
      <TradeStack.Screen
        name="BorrowStep2"
        component={Borrow.Step2}
        options={{ headerLeft: () => undefined }}
      />
      <TradeStack.Screen name="LendStep1" component={Lend.Step1} />
      <TradeStack.Screen
        name="LendStep2"
        component={Lend.Step2}
        options={{ headerLeft: () => undefined }}
      />
    </TradeStack.Navigator>
  );
}

function MainScreen({ navigation }) {
  const uid = useRecoilValue(authState);
  const [tickets, setTickets] = useState(null);
  const user = useUserDocumentListener();
  const [invokeFetchTickets, setInvokeFetchTickets] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [cannotBorrow, setCannotBorrow] = useState(true);
  const toast = useToast();

  const goToBorrow = () => {
    navigation.navigate("BorrowStep1");
  };

  const handleCancelBorrow = async (borrowTicketId) => {
    try {
      await store.deleteBorrowTicket({
        borrowTicketId,
        uid,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setInvokeFetchTickets(!invokeFetchTickets);
    }
  };

  const canUserLoanAmount = (amount) => {
    return user.today.remainingBudget > parseInt(amount, 10);
  };

  const handleClickItem = (borrowObj) => {
    if (borrowObj.borrowerId === uid) {
      handleCancelBorrow(borrowObj.borrowTicketId);
    } else {
      if (canUserLoanAmount(borrowObj.amount)) {
        navigation.navigate("LendStep1", { borrowObj });
      } else {
        toast.show({
          render: ({ id }) => (
            <StyledToast
              id={id}
              action="error"
              title="Cannot lend"
              description="You don't have enough credit :("
            />
          ),
        });
      }
    }
  };

  useEffect(() => {
    async function getTickets() {
      setLoading(true);
      const tickets = await store.getBorrowTickets();
      setTickets(tickets);
      setLoading(false);
    }

    getTickets();
  }, [invokeFetchTickets]);

  useEffect(() => {
    if (user) {
      if (user.tickets.borrow.length > 0) {
        setCannotBorrow(true);
      } else {
        setCannotBorrow(false);
      }
    }
  }, [user]);

  return (
    <StyledView>
      <VStack alignSelf="flex-end" alignItems="flex-end" flex={0.2}>
        <Text size="sm">You currently have</Text>
        <Heading size="md">{user?.today.remainingBudget.toFixed(2)} kg</Heading>
      </VStack>
      <VStack flex={1} space="lg">
        <Heading>Users seeking to borrow</Heading>
        <ScrollView>
          {isLoading ? (
            <Center minHeight={200}>
              <Spinner />
            </Center>
          ) : tickets && tickets.length > 0 ? (
            tickets
              .sort((a, b) => b.date_created - a.date_created)
              .map((ticket) => (
                <ListItem
                  key={ticket.borrowTicketId}
                  username={ticket.borrowerUsername}
                  timestamp={ticket.date_created}
                  amount={ticket.amount}
                  isCurrentUser={ticket.borrowerId === uid}
                  onClick={() => handleClickItem(ticket)}
                />
              ))
          ) : (
            <Center>
              <Text color="$textLight300">There are no requests</Text>
            </Center>
          )}
        </ScrollView>
      </VStack>
      <View flex={0.2} gap={10}>
        <TextButton
          label={cannotBorrow ? "Cannot Borrow" : "I want to Borrow"}
          onPress={goToBorrow}
          isDisabled={cannotBorrow}
        />
      </View>
    </StyledView>
  );
}

function ListItem({ username, timestamp, amount, onClick, isCurrentUser }) {
  const date = timeAgo(timestamp.toDate());

  return (
    <VStack paddingVertical={10}>
      <HStack justifyContent="space-between" alignItems="center" space="md">
        <Avatar backgroundColor="$trueGray300" size="sm">
          <Icon as={User} size="lg" />
        </Avatar>
        <VStack flex={1}>
          <Heading size="md">{username}</Heading>
          <Text size="sm">{date}</Text>
        </VStack>
        <Heading size="md">{parseInt(amount, 10).toFixed(2)} kg</Heading>
        <Button
          backgroundColor={isCurrentUser ? "$red200" : "$trueGray300"}
          size="xs"
          onPress={onClick}
          flex={0.3}
        >
          <ButtonText color={isCurrentUser ? "$red400" : "$trueGray600"}>
            {isCurrentUser ? "Cancel" : "Lend"}
          </ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
}
