import { Text, VStack, HStack } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";

import activityMetrics from "../../../../assets/data/daily_activity.json";
import { CAR_ITEMS, CAR_TYPE_ITEMS } from "../../../config/constants";
import { Dropdown, TextInput } from "../../base";

const transporationMetrics = activityMetrics.transportation.types;

export default function Transportation({ onCalculate }) {
  const [transportationType, setTransportationType] = useState("");
  const [carType, setCarType] = useState("");
  const [distance, setDistance] = useState("");

  useEffect(() => {
    if (transportationType !== "car") {
      setCarType("");
      onCalculate(null, null); // Reset deduction amount
    }
  }, [transportationType]);

  useEffect(() => {
    if (transportationType && distance) {
      if (transportationType === "car" && !carType) {
        onCalculate(null, null); // Reset deduction amount
        return;
      }
      const type = transportationType === "car" ? carType : transportationType;
      const deductionAmount = (
        transporationMetrics[type] * Number(distance)
      ).toFixed(2);

      onCalculate(type, deductionAmount);
    } else {
      onCalculate(null, null); // Reset deduction amount if inputs are incomplete
    }
  }, [transportationType, carType, distance]);

  return (
    <VStack space="lg" marginTop={40}>
      <HStack alignItems="center">
        <Text>By</Text>
        <Dropdown
          items={CAR_ITEMS}
          value={transportationType}
          onValueChange={setTransportationType}
          placeholder="Select transit type"
          flex={0.4}
        />
        {transportationType === "car" && (
          <Dropdown
            items={CAR_TYPE_ITEMS}
            value={carType}
            onValueChange={setCarType}
            placeholder="Select Car Type"
          />
        )}
        <Text>,</Text>
      </HStack>
      <HStack alignItems="center">
        <Text>I travelled </Text>
        <TextInput
          value={distance}
          onChangeText={setDistance}
          type="number"
          maxLength={3}
          flex={0.3}
        />
        <Text>km</Text>
      </HStack>
    </VStack>
  );
}
