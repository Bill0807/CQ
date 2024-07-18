import {
  Button,
  ButtonIcon,
  ButtonText,
  HStack,
  Heading,
  ScrollView,
  Text,
  View,
  VStack,
  KeyboardAvoidingView,
} from "@gluestack-ui/themed";
import {
  ArrowRight,
  Gift,
  GlassWater,
  Lightbulb,
  Palette,
  Recycle,
  ShoppingBag,
  Trash2,
  TreePine,
} from "lucide-react-native";
import { useState } from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import { useRecoilValue } from "recoil";

import offsetMetrics from "../../../assets/data/daily_offset.json";
import { StyledView, TextButton } from "../../components/base";
import TextArea from "../../components/base/TextArea";
import store from "../../config/firebase/store";
import { authState, userState } from "../../stores/auth-state";

function Step1({ navigation }) {
  const [selection, setSelection] = useState();

  const goToStep2 = () => {
    navigation.navigate("OffsetStep2", { selection });
  };

  return (
    <StyledView>
      <Text>Add Carbon Offset</Text>
      <Heading size="xl">What offset activity did you do?</Heading>
      <VStack flex={0.5} marginVertical={5} space="md" justifyContent="center">
        {selection ? (
          <>
            <Text>{selection.description}</Text>
            <Text bold>Credits: {selection.credit}</Text>
          </>
        ) : (
          <Text>Select an activity...</Text>
        )}
      </VStack>
      <ScrollView flex={1}>
        <HStack flexWrap="wrap" space="lg">
          {Object.entries(offsetMetrics).map(([key, value]) => (
            <CategoryButton
              onPress={() => setSelection({ key, ...value })}
              title={value.title}
              isSelected={selection && selection.key === key}
              key={key}
              id={key}
            />
          ))}
        </HStack>
      </ScrollView>
      <View flex={0.2} justifyContent="flex-end" alignItems="flex-end">
        {selection && (
          <TextButton onPress={goToStep2} label="Next" icon={ArrowRight} />
        )}
      </View>
    </StyledView>
  );
}

function CategoryButton({ onPress, title, isSelected, id }) {
  const icons = {
    recycling: Recycle,
    art_project: Palette,
    green_gifting: Gift,
    energy_bulbs: Lightbulb,
    reusable_bottles: GlassWater,
    eco_bag: ShoppingBag,
    clean_neighborhood: Trash2,
    plant_tree: TreePine,
  };

  return (
    <Button
      onPress={onPress}
      backgroundColor={isSelected ? "$primary500" : "$secondary300"}
    >
      <ButtonIcon as={icons[id]} />
      <ButtonText paddingLeft={5}>{title}</ButtonText>
    </Button>
  );
}

function Step2({ route, navigation }) {
  const { selection } = route.params;
  const uid = useRecoilValue(authState);
  const [learn, setLearn] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleOffset = async () => {
    if (!learn) return;

    try {
      setLoading(true);
      const offset = {
        category: selection.key,
        value: Number(selection.credit),
        description: learn,
        timestamp: Date.now(),
      };
      await store.setOffset({ uid, offset });
      navigation.navigate("OffsetStep3", { selection });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledView>
      <KeyboardAvoidingView
        flex={1}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={120}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <VStack space="2xl">
            <Heading>Give details</Heading>
            <View
              minHeight={100}
              backgroundColor="$backgroundLight200"
              justifyContent="center"
              padding={15}
              borderRadius={4}
            >
              <VStack space="sm">
                <Text bold>{selection.title}</Text>
                <Text>{selection.description}</Text>
              </VStack>
            </View>
            <TextArea
              value={learn}
              onChangeText={setLearn}
              labelText="What did you learn from doing this activity?"
            />
            <TextButton
              label="Confirm"
              onPress={handleOffset}
              isLoading={isLoading}
              isDisabled={isLoading || !learn}
            />
          </VStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </StyledView>
  );
}

function Step3({ route, navigation }) {
  const { selection } = route.params;
  const user = useRecoilValue(userState);

  const handlePress = () => {
    // reset the navigation state
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  };

  return (
    <StyledView justifyContent="center">
      <VStack alignItems="center" flex={0.5} justifyContent="space-between">
        <View>
          <Text size="2xl">You've offset</Text>
          <Heading size="3xl">
            {selection.credit} kg C0<Heading size="xl">2</Heading>
          </Heading>
        </View>
        <Text>
          You have {user.today.remainingBudget.toFixed(2)} CO
          <Text size="xs">2</Text> remaining for today
        </Text>
        <TextButton onPress={handlePress} width="80%" label="Okay" />
      </VStack>
    </StyledView>
  );
}

export default { Step1, Step2, Step3 };
