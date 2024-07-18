import { Text } from "@gluestack-ui/themed";

import Electricity from "./Electricity";
import Food from "./Food";
import Transportation from "./Transportation";
import Waste from "./Waste";

const categories = {
  Electricity,
  Food,
  Waste,
  Transportation,
};

export default function ActivityForms({ category, onCalculate }) {
  const Form = categories[category];

  if (!Form) {
    return <Text>Invalid category</Text>;
  }

  return <Form onCalculate={onCalculate} />;
}
