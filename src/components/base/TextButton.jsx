import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
  HStack,
} from "@gluestack-ui/themed";
import { useRecoilValue } from "recoil";

import { schoolThemeState } from "../../stores/auth-state";

export default function TextButton({
  label,
  onPress,
  size = "md",
  variant = "solid",
  isDisabled = false,
  isLoading = false,
  icon,
  ...props
}) {
  const schoolTheme = useRecoilValue(schoolThemeState);
  const isSolid = variant === "solid";

  return (
    <Button
      size={size}
      variant={variant}
      backgroundColor={isSolid ? schoolTheme.primary500 : "transparent"}
      onPress={onPress}
      isDisabled={isDisabled}
      {...props}
    >
      {isLoading && <ButtonSpinner mr="$2" />}
      <HStack alignItems="center" space="sm">
        <ButtonText color={isSolid ? "$white" : schoolTheme.primary500}>
          {label}
        </ButtonText>
        {icon && <ButtonIcon as={icon} />}
      </HStack>
    </Button>
  );
}
