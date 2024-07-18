import { Icon } from "@gluestack-ui/themed";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  HomeIcon,
  ArrowRightLeft,
  LineChart,
  PlusCircle,
} from "lucide-react-native";
import { useRecoilValue } from "recoil";

import useAuthStateListener from "../hooks/useAuthStateListener";
import HomeScreens from "../screens/Home";
import Login from "../screens/Login";
import ReportScreens from "../screens/Report";
import Signup from "../screens/Signup";
import Start from "../screens/Start";
import TrackScreens from "../screens/Track";
import TradeScreens from "../screens/Trade";
import {
  authState,
  navigationThemeSelector,
  schoolThemeState,
} from "../stores/auth-state";

export default function RootNavigator() {
  const isAuthenticated = useAuthStateListener();
  const theme = useRecoilValue(navigationThemeSelector);

  return (
    <NavigationContainer theme={theme}>
      {isAuthenticated ? <HomeTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

function HomeTabs() {
  const Tab = createBottomTabNavigator();
  const theme = useRecoilValue(schoolThemeState);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let icon;

          switch (route.name) {
            case "Home":
              icon = HomeIcon;
              break;
            case "Report":
              icon = LineChart;
              break;
            case "Trade":
              icon = ArrowRightLeft;
              break;
            case "Track":
              icon = PlusCircle;
              break;
            default:
              break;
          }

          return <Icon as={icon} color={color} size={size} />;
        },
        tabBarActiveTintColor: theme.primary500,
      })}
    >
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="Home"
        component={HomeScreens}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreens}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Track"
        component={TrackScreens}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Trade"
        component={TradeScreens}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Start"
        component={Start}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}
