import { Button, ButtonIcon, ScrollView, VStack } from "@gluestack-ui/themed";
import { createStackNavigator } from "@react-navigation/stack";
import { LogOut } from "lucide-react-native";

import Profile from "./Profile";
import {
  Dashboard,
  ActivityList,
  MonthlyChallenge,
} from "../../components/home";
import useUserDocumentListener from "../../hooks/useUserDocumentListener";

export default function HomeScreens({ navigation }) {
  const HomeStack = createStackNavigator();

  const goToProfile = () => {
    navigation.navigate("Profile");
  };

  return (
    <HomeStack.Navigator initialRouteName="Main">
      <HomeStack.Screen
        name="Main"
        component={Main}
        options={{
          headerTitle: "Home",
          headerRight: () => (
            <Button onPress={goToProfile} backgroundColor="transparent">
              <ButtonIcon as={LogOut} color="$textLight900" />
            </Button>
          ),
        }}
      />
      <HomeStack.Screen name="Profile" component={Profile} />
    </HomeStack.Navigator>
  );
}

function Main({ navigation }) {
  const user = useUserDocumentListener();
  return (
    <ScrollView padding={30}>
      <VStack gap={60}>
        <Dashboard user={user} />
        <ActivityList
          user={user}
          onAddActivity={() => navigation.navigate("Track")}
        />
        <MonthlyChallenge />
      </VStack>
    </ScrollView>
  );
}
