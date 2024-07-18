import {
  View,
  Text,
  HStack,
  VStack,
  Heading,
  Icon,
} from "@gluestack-ui/themed";
import { MoveDown, MoveUp } from "lucide-react-native";
import { Platform } from "react-native";
import { useRecoilValue } from "recoil";

import { loadingState } from "../../stores/app-state";
import { Skeleton } from "../base";

const MONTHLY_CHALLENGE_BONUS = 10;
const currentMonth = new Date().getMonth() + 1;
console.log("currentMonth >>> ", currentMonth);

export default function Dashboard({ user }) {
  const isLoading = useRecoilValue(loadingState);

  return (
    <VStack space="xl">
      <VStack>
        <VStack alignItems="flex-end">
          <Text size="sm">Total Carbon Credit</Text>
          {isLoading ? (
            <Skeleton containerHeight={30} containerWidth={100} />
          ) : (
            <>
              <Heading
                size="md"
                paddingTop={Platform.OS === "android" ? 10 : 0}
              >
                {user && user.monthly[currentMonth]?.remainingBudget.toFixed(2)}{" "}
                kg CO
                <Heading size="xs">2</Heading>
              </Heading>
              <Heading size="xs" color="$green500">
                {user && user.monthly[currentMonth]?.challenge.date
                  ? `+${MONTHLY_CHALLENGE_BONUS} bonus`
                  : ""}
              </Heading>
            </>
          )}
        </VStack>
        <VStack alignSelf="flex-start">
          <Text size="lg">Today's Budget</Text>
          {isLoading ? (
            <Skeleton containerHeight={55} containerWidth={200} />
          ) : (
            <Heading size="3xl" paddingTop={Platform.OS === "android" ? 10 : 0}>
              {user && user.today.remainingBudget.toFixed(2)}
              kg CO
              <Heading size="xl">2</Heading>
            </Heading>
          )}
        </VStack>
      </VStack>
      <BudgetBar
        emissionTotal={user && user.today.emissionTotal}
        offsetTotal={user && user.today.offsetTotal}
      />
      <HStack justifyContent="space-between" alignItems="center">
        <VStack flex={1}>
          <Text>Your emission</Text>
          <HStack alignItems="center">
            {isLoading ? (
              <Skeleton containerHeight={40} containerWidth={140} />
            ) : (
              <Heading
                size="xl"
                paddingTop={Platform.OS === "android" ? 20 : 0}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user && user.today.emissionTotal.toFixed(2)} kg CO
                <Heading size="xs">2</Heading>
              </Heading>
            )}
            <Icon as={MoveDown} strokeWidth={3} color="$red500" />
          </HStack>
        </VStack>
        <VStack alignItems="flex-end" flex={1}>
          <Text>Your offset</Text>
          <HStack alignItems="center">
            {isLoading ? (
              <Skeleton containerHeight={40} containerWidth={140} />
            ) : (
              <Heading
                size="xl"
                paddingTop={Platform.OS === "android" ? 20 : 0}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user && user.today.offsetTotal.toFixed(2)} kg CO
                <Heading size="xs">2</Heading>
              </Heading>
            )}
            <Icon as={MoveUp} strokeWidth={3} color="$green500" />
          </HStack>
        </VStack>
      </HStack>
    </VStack>
  );
}

function BudgetBar({ emissionTotal, offsetTotal }) {
  const baseBudget = 6;

  const currentTotal = baseBudget - emissionTotal + offsetTotal;
  let emissionPercentage, offsetPercentage;

  if (currentTotal <= 0) {
    emissionPercentage = 100;
    offsetPercentage = 0;
  } else {
    // Calculate emission and offset percentages relative to the current total budget
    emissionPercentage = (emissionTotal / currentTotal) * 100;
    offsetPercentage = (offsetTotal / currentTotal) * 100;

    // Ensure the sum of emission and offset percentages does not exceed 100%
    if (emissionPercentage + offsetPercentage > 100) {
      const totalPercentage = emissionPercentage + offsetPercentage;
      emissionPercentage = (emissionPercentage / totalPercentage) * 100;
      offsetPercentage = (offsetPercentage / totalPercentage) * 100;
    }
  }

  return (
    <VStack>
      <View
        height={50}
        backgroundColor="$trueGray200"
        borderRadius="$full"
        borderWidth={1}
        overflow="hidden"
        borderColor="$trueGray500"
        flexDirection="row"
      >
        <View
          height="$full"
          width={`${emissionPercentage}%`}
          backgroundColor="$red500"
          borderTopLeftRadius="$full"
          borderBottomLeftRadius="$full"
        />
        <View
          height="$full"
          width={`${offsetPercentage}%`}
          backgroundColor="$green500"
        />
      </View>
    </VStack>
  );
}
