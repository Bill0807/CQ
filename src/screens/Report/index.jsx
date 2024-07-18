import { createStackNavigator } from "@react-navigation/stack";

import Main from "./Main";
import MonthActivity from "./MonthActivity";
import { MonthlyActivityProvider } from "../../stores/monthly-activity.context";

export default function ReportScreens() {
  const ReportStack = createStackNavigator();

  return (
    <MonthlyActivityProvider>
      <ReportStack.Navigator
        initialRouteName="Main"
        screenOptions={{ headerTitle: "Report", headerBackTitle: "back" }}
      >
        <ReportStack.Screen name="Main" component={Main} />
        <ReportStack.Screen name="MonthActivity" component={MonthActivity} />
      </ReportStack.Navigator>
    </MonthlyActivityProvider>
  );
}
