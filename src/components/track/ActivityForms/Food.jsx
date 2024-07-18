import { Text, VStack, HStack } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";

import activityMetrics from "../../../../assets/data/daily_activity.json";
import { FOOD_ITEMS, SERVING_ITEMS } from "../../../config/constants";
import { Dropdown } from "../../base";

const foodMetrics = activityMetrics.food.types;

export default function Food({ onCalculate }) {
  const [serving, setServing] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (serving && type) {
      const deductionAmount = (foodMetrics[type] * Number(serving)).toFixed(2);
      onCalculate(type, deductionAmount);
    }
  }, [serving, type]);

  return (
    <VStack space="md" marginVertical={40}>
      <HStack alignItems="center">
        <Text> I ate</Text>
        <Dropdown
          items={SERVING_ITEMS}
          value={serving}
          onValueChange={setServing}
          placeholder="Select serving type..."
          flex={0.6}
        />
      </HStack>
      <HStack alignItems="center">
        <Text> of </Text>
        <Dropdown
          items={FOOD_ITEMS}
          value={type}
          onValueChange={setType}
          placeholder="Select food type..."
          flex={0.85}
        />
      </HStack>
    </VStack>
  );
}
