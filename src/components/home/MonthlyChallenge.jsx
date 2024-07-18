import {
  View,
  HStack,
  Text,
  Heading,
  Avatar,
  Icon,
  VStack,
} from "@gluestack-ui/themed";
import { User } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import store from "../../config/firebase/store";
import { monthlyChallengeState } from "../../stores/app-state";

export default function MonthlyChallenge() {
  const monthlyChallenge = useRecoilValue(monthlyChallengeState);
  return (
    <VStack space="3xl" paddingBottom={100}>
      <Heading size="lg">This Month's Challenge</Heading>
      <View
        minHeight={100}
        backgroundColor="$backgroundLight200"
        justifyContent="center"
        alignItems="center"
        borderRadius={4}
      >
        {monthlyChallenge && (
          <>
            <Text bold>{monthlyChallenge.title}</Text>
            <Text>{monthlyChallenge.description}</Text>
          </>
        )}
      </View>
      <Leaderboard />
    </VStack>
  );
}

export function Leaderboard() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    console.log("users @ Leaderboard >>> ", users);
  }, [users]);

  useEffect(() => {
    async function getUsersFromFirestore() {
      const users = await store.getAllUsers();
      console.log("allUsers >>> ", users);
      if (users) {
        const filteredUsers = users
          .sort((a, b) => b.monthly.offsetTotal - a.monthly.offsetTotal)
          .slice(0, 5)
          .map((user) => ({
            username: user.username,
            offsetTotal: user.monthly.offsetTotal,
          }));
        console.log("filteredUsers >>> ", filteredUsers);
        setUsers(filteredUsers);
      }
    }

    getUsersFromFirestore();
  }, []);

  return (
    <VStack space="sm">
      <View marginBottom={10}>
        <Text>This Month's Leaderboard</Text>
        <Text size="sm">(For Offsets)</Text>
      </View>
      {users ? (
        users.map((item, index) => (
          <ListItem
            username={item.username}
            value={item.offsetTotal}
            order={index + 1}
            key={index}
          />
        ))
      ) : (
        <Text textAlign="center" color="$textLight300">
          No leaders for now...
        </Text>
      )}
    </VStack>
  );
}

function ListItem({ username, value, order }) {
  return (
    <View paddingVertical={10}>
      <HStack justifyContent="space-between">
        <HStack alignItems="center" space="lg">
          <Text>{order}</Text>
          <Avatar bgColor="$trueGray300" size="sm">
            <Icon as={User} color="white" size="lg" />
          </Avatar>
          <Text>{username}</Text>
        </HStack>
        <Heading size="sm">{value} kg</Heading>
      </HStack>
    </View>
  );
}
