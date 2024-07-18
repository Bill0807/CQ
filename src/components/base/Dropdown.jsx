import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  Icon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@gluestack-ui/themed";
import { ChevronDown } from "lucide-react-native";

export default function Dropdown({
  value,
  onValueChange,
  placeholder,
  items,
  ...props
}) {
  // Find the label that corresponds to the value
  const selectedLabel = items?.find((item) => item.value === value)?.label;

  return (
    <Select flex={1} onValueChange={onValueChange} {...props}>
      <SelectTrigger variant="underlined" paddingLeft={10}>
        <SelectInput placeholder={placeholder} value={selectedLabel || ""} />
        <SelectIcon mr="$3">
          <Icon as={ChevronDown} />
        </SelectIcon>
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent flex={1}>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {items &&
            items.map(({ label, value }) => (
              <SelectItem key={value} label={label} value={value} />
            ))}
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}
