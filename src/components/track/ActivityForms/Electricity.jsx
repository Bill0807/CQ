import { Text, VStack, HStack } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";

import activityMetrics from "../../../../assets/data/daily_activity.json";
import {
  ELECTRICITY_CATEGORIES,
  DEVICE_ITEMS,
  DEVICE_UNITS,
  HAIRLENGTHS,
} from "../../../config/constants";
import { Dropdown, TextInput } from "../../base";

const electricityMetrics = activityMetrics.electricity.types;

export default function Electricity({ onCalculate }) {
  const [category, setCategory] = useState("");
  const [device, setDevice] = useState("");
  const [hairLength, setHairLength] = useState("");
  const [amount, setAmount] = useState("");

  // Reset device and amount when category changes
  useEffect(() => {
    setDevice("");
    setAmount("");
  }, [category]);

  // Reset hair length and amount when device changes
  useEffect(() => {
    setHairLength("");
    setAmount("");
  }, [device]);

  useEffect(() => {
    // Ensure all necessary fields are filled
    if (
      !category ||
      !device ||
      (device === "hairdryer" && !hairLength) ||
      (device !== "hairdryer" && !amount)
    ) {
      onCalculate(null, null);
      return;
    }

    // Handle the special case for hairdryer
    const deviceKey = device === "hairdryer" ? hairLength : device;

    // Get the deduction amount per hour for the selected device
    const perHourAmount = electricityMetrics[category][deviceKey];

    if (device === "hairdryer") {
      onCalculate(deviceKey, perHourAmount);
    } else {
      // Convert amount to hours if necessary
      const timeInHours =
        DEVICE_UNITS[device] === "mins" ? Number(amount) / 60 : Number(amount);

      // Calculate the deduction amount
      const deductionAmount = (perHourAmount * timeInHours).toFixed(2);
      onCalculate(deviceKey, deductionAmount);
    }
  }, [category, device, hairLength, amount, onCalculate]);

  return (
    <VStack space="md" marginTop={20}>
      <HStack alignItems="center">
        <Text>In </Text>
        <Dropdown
          items={ELECTRICITY_CATEGORIES}
          value={category}
          onValueChange={setCategory}
          placeholder="Select a category"
          flex={0.85}
        />
        <Text>,</Text>
      </HStack>
      <HStack alignItems="center">
        <Text>I used </Text>
        <Dropdown
          items={category ? DEVICE_ITEMS[category] : undefined}
          value={device}
          onValueChange={setDevice}
          placeholder="Select a device"
          flex={0.85}
        />
      </HStack>
      <HStack alignItems="center">
        <Text>for </Text>
        {device === "hairdryer" ? (
          <Dropdown
            items={HAIRLENGTHS}
            value={hairLength}
            onValueChange={setHairLength}
            placeholder="Select hair length"
            flex={0.85}
          />
        ) : (
          <>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              type="number"
              maxLength={3}
              flex={0.3}
            />
            <Text>{device ? DEVICE_UNITS[device] : ""}</Text>
          </>
        )}
      </HStack>
    </VStack>
  );
}
