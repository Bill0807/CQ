import { Heading, VStack } from "@gluestack-ui/themed";
import { createStackNavigator } from "@react-navigation/stack";
import { PlusCircle, MinusCircle } from "lucide-react-native";
import { useEffect } from "react";

import Activity from "./Activity";
import Monthly from "./Monthly";
import Offset from "./Offset";
import { StyledView, TextButton } from "../../components/base";

export default function TrackScreens({ navigation }) {
  const TrackStack = createStackNavigator();

  useEffect(() => {
    const resetStack = navigation.addListener("blur", () => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    });

    return resetStack;
  }, [navigation]);

  return (
    <TrackStack.Navigator
      screenOptions={{ headerTitle: "Track", headerBackTitle: "back" }}
      initialRouteName="Main"
    >
      <TrackStack.Screen name="Main" component={MainScreen} />
      <TrackStack.Screen name="ActivityStep1" component={Activity.Step1} />
      <TrackStack.Screen name="ActivityStep2" component={Activity.Step2} />
      <TrackStack.Screen
        name="ActivityStep3"
        component={Activity.Step3}
        options={{ headerLeft: () => undefined }}
      />
      <TrackStack.Screen name="OffsetStep1" component={Offset.Step1} />
      <TrackStack.Screen name="OffsetStep2" component={Offset.Step2} />
      <TrackStack.Screen
        name="OffsetStep3"
        component={Offset.Step3}
        options={{ headerLeft: () => undefined }}
      />
      <TrackStack.Screen name="MonthlyStep1" component={Monthly.Step1} />
      <TrackStack.Screen
        name="MonthlyStep2"
        component={Monthly.Step2}
        options={{ headerLeft: () => undefined }}
      />
    </TrackStack.Navigator>
  );
}

function MainScreen({ navigation }) {
  const goToActivity = () => {
    navigation.navigate("ActivityStep1");
  };

  const goToOffset = () => {
    navigation.navigate("OffsetStep1");
  };

  const goToMonthly = () => {
    navigation.navigate("MonthlyStep1");
  };

  return (
    <StyledView>
      <Heading size="xl">What did you do today?</Heading>
      <VStack justifyContent="space-evenly" flex={1} alignItems="center">
        <AddButton
          text="Add Emission"
          icon={MinusCircle}
          onPress={goToActivity}
        />
        <AddButton text="Add Offset" icon={PlusCircle} onPress={goToOffset} />
        <AddButton
          text="Monthly Challenge"
          onPress={goToMonthly}
          backgroundColor="$amber400"
        />
      </VStack>
    </StyledView>
  );
}

function AddButton({ onPress, text, icon, ...props }) {
  return (
    <TextButton
      label={text}
      icon={icon}
      onPress={onPress}
      height={100}
      width={225}
      size="lg"
      {...props}
    />
  );
}
