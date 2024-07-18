import { Text, VStack, HStack } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";

import activityMetrics from "../../../../assets/data/daily_activity.json";
import { WASTE_ITEMS } from "../../../config/constants";
import { Dropdown, TextInput } from "../../base";

const wasterMetrics = activityMetrics.waste.types;

export default function Waste({ onCalculate }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (amount && type) {
      const deductionAmount = (wasterMetrics[type] * Number(amount)).toFixed(2);
      onCalculate(type, deductionAmount);
    }
  }, [amount, type]);

  return (
    <VStack space="md" marginTop={20}>
      <HStack>
        <Text>I produced</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          flex={0.2}
          paddingLeft={5}
          isRequired={false}
          type="number"
          maxLength={3}
        />
        <Text>kg</Text>
      </HStack>
      <HStack alignItems="center">
        <Text>of</Text>
        <Dropdown
          items={WASTE_ITEMS}
          value={type}
          onValueChange={setType}
          placeholder="Select waste type..."
        />
        <Text>waste</Text>
      </HStack>
    </VStack>
  );
}
