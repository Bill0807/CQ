import { ScrollView, Text, VStack } from "@gluestack-ui/themed";

import { StyledView } from "../../components/base";
import Tables from "../../components/report/Tables";
import { useMonthlyActivity } from "../../stores/monthly-activity.context";

export default function MonthActivity() {
  const list = useMonthlyActivity();

  return (
    <StyledView>
      <ScrollView>
        <VStack>
          <Text bold textAlign="right">
            Total: {list && list.length}
          </Text>
          {list && <Tables.MonthActivity monthData={list} />}
        </VStack>
      </ScrollView>
    </StyledView>
  );
}
