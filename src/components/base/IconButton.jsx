import { Button, ButtonIcon } from "@gluestack-ui/themed";
import { useRecoilValue } from "recoil";

import { schoolThemeState } from "../../stores/auth-state";

export default function IconButton({ onPress, icon, size = 50, ...props }) {
  const schoolTheme = useRecoilValue(schoolThemeState);
  return (
    <Button
      backgroundColor={schoolTheme.primary500}
      onPress={onPress}
      {...props}
    >
      <ButtonIcon as={icon} size={50} />
    </Button>
  );
}
