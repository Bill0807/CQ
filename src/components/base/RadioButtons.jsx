import {
  CircleIcon,
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  HStack,
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@gluestack-ui/themed";

export default function RadioButtons({
  value,
  onChange,
  options,
  isInvalid,
  isRequired = true,
  errorText,
  labelText,
  ...props
}) {
  return (
    <FormControl isRequired={isRequired} isInvalid={isInvalid} {...props}>
      {labelText && (
        <FormControlLabel>
          <FormControlLabelText>{labelText}</FormControlLabelText>
        </FormControlLabel>
      )}
      <RadioGroup value={value} onChange={onChange} marginVertical="$2">
        <HStack space="2xl">
          {options.map((option) => (
            <Radio value={option.value} key={option.value}>
              <RadioIndicator mr="$2">
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel>{option.label}</RadioLabel>
            </Radio>
          ))}
        </HStack>
      </RadioGroup>
      {errorText && (
        <FormControlError>
          <FormControlErrorText>{errorText}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
