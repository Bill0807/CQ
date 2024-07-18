import { View, HStack, Avatar, Icon, Text, VStack } from "@gluestack-ui/themed";
import { Car, Pizza, Zap, Trash2, Check } from "lucide-react-native";
import { useEffect, useState } from "react";

import {
  EMISSION_CATEGORIES,
  emissionLabels,
  offsetLabels,
} from "../../config/constants";
import { Skeleton, TextButton } from "../base";

export default function ActivityList({ onAddActivity, user }) {
  const [list, setList] = useState(null);

  useEffect(() => {
    let combinedList;

    if (user) {
      combinedList = user.today.emissions.concat(user.today.offsets);
      combinedList = combinedList
        .filter((activity) => activity)
        .map((activity) => {
          const isEmissions = EMISSION_CATEGORIES.includes(activity.category);
          return {
            ...activity,
            isEmissions,
          };
        });
      combinedList.sort((a, b) => b.timestamp - a.timestamp);
      setList(combinedList);
    }
  }, [user]);

  return (
    <VStack space="lg">
      <HStack alignItems="center" justifyContent="space-between">
        <Text>What you did today</Text>
        <TextButton size="xs" onPress={onAddActivity} label="Add Activity" />
      </HStack>
      <View>
        {list ? (
          list.length > 0 ? (
            list.map((item, index) => (
              <ListItem
                category={item.category}
                value={item.value}
                type={item.type}
                isEmissions={item.isEmissions}
                key={index}
              />
            ))
          ) : (
            <Text textAlign="center" color="$textLight300">
              You have no activity logged
            </Text>
          )
        ) : (
          <Skeleton containerHeight={100} containerWidth="100%" />
        )}
      </View>
    </VStack>
  );
}

function ListItem({ category, value, type, isEmissions }) {
  let icon = Car;

  switch (category) {
    case "Transportation":
      icon = Car;
      break;
    case "Food":
      icon = Pizza;
      break;
    case "Waste":
      icon = Trash2;
      break;
    case "Electricity":
      icon = Zap;
      break;
    default:
      icon = Check;
  }

  const label = type ? emissionLabels[type] : offsetLabels[category];

  return (
    <View paddingVertical={10}>
      <HStack alignItems="center" justifyContent="space-between" space="md">
        <Avatar bgColor={isEmissions ? "$trueGray300" : "$green500"} size="sm">
          <Icon as={icon} color="white" size="sm" />
        </Avatar>
        <Text flex={1}>{label}</Text>
        <Text>{value.toFixed(2)} kg</Text>
      </HStack>
    </View>
  );
}
