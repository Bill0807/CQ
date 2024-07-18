import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { RecoilRoot } from "recoil";

import RootNavigator from "./src/navigators/RootNavigator";

export default function App() {
  return (
    <RecoilRoot>
      <GluestackUIProvider config={config}>
        <RootNavigator />
      </GluestackUIProvider>
    </RecoilRoot>
  );
}
