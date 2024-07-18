import { View } from "@gluestack-ui/themed";

export default function StyledView({ children, ...props }) {
  return (
    <View p={30} flex={1} {...props}>
      {children}
    </View>
  );
}
