import {
  HStack,
  Heading,
  Icon,
  ScrollView,
  Text,
  VStack,
  View,
} from "@gluestack-ui/themed";
import { MoveDown, MoveUp } from "lucide-react-native";

import { StyledView, TextButton } from "../../components/base";
import Tables from "../../components/report/Tables";
import { MONTH_NAMES } from "../../config/constants";
import useUserDocumentListener from "../../hooks/useUserDocumentListener";
import { useMonthlyActivity } from "../../stores/monthly-activity.context";

const currentMonthIndex = new Date().getMonth();
const currentMonthName = MONTH_NAMES[currentMonthIndex];

const LIST_MAX_SHOWN = 5;

export default function Main({ navigation }) {
  const user = useUserDocumentListener();
  const list = useMonthlyActivity();

  const goToMonthActivity = () => {
    navigation.navigate("MonthActivity");
  };

  return (
    <StyledView paddingHorizontal={20}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack gap={50}>
          <VStack space="2xl">
            <View>
              <Text>{currentMonthName} Carbon Credit</Text>
              <Heading size="2xl">
                {user &&
                  user.monthly[currentMonthIndex + 1].remainingBudget.toFixed(
                    2,
                  )}{" "}
                kg CO<Heading size="lg">2</Heading>
              </Heading>
            </View>
            <HStack justifyContent="space-between">
              <VStack>
                <Text size="sm">You emitted this much</Text>
                <HStack alignItems="center">
                  <Heading>
                    {user &&
                      user.monthly[currentMonthIndex + 1].emissionTotal.toFixed(
                        2,
                      )}{" "}
                    kg
                  </Heading>
                  <Icon as={MoveDown} strokeWidth={3} color="$red500" />
                </HStack>
              </VStack>
              <VStack>
                <Text size="sm">You offset this much</Text>
                <HStack alignItems="center">
                  <Heading>
                    {user &&
                      user.monthly[currentMonthIndex + 1].offsetTotal.toFixed(
                        2,
                      )}{" "}
                    kg
                  </Heading>
                  <Icon as={MoveUp} strokeWidth={3} color="$green500" />
                </HStack>
              </VStack>
            </HStack>
          </VStack>
          <View>
            <HStack alignItems="center" justifyContent="space-between">
              <Heading flex={1} size="sm">
                Understand your footprint
              </Heading>
              {list && list.length > LIST_MAX_SHOWN && (
                <TextButton
                  size="xs"
                  onPress={goToMonthActivity}
                  label="See More"
                />
              )}
            </HStack>
            {list && (
              <Tables.MonthActivity monthData={list.slice(0, LIST_MAX_SHOWN)} />
            )}
          </View>
          <View>
            <Text size="lg">Past Months</Text>
            <Tables.MonthlySummary monthlyData={user && user.monthly} />
          </View>
        </VStack>
      </ScrollView>
    </StyledView>
  );
}
