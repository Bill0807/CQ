import { FormControl, Input, InputField } from "@gluestack-ui/themed";

export default function TextInput({
  labelText,
  errorText,
  isInvalid = false,
  isRequired = true,
  value,
  onChangeText,
  type,
  maxLength,
  maxValue,
  ...props
}) {
  let keyboardType;
  let handleChangeText;

  switch (type) {
    case "email":
      keyboardType = "email-address";
      handleChangeText = onChangeText;
      break;
    case "number":
      keyboardType = "number-pad";
      handleChangeText = (value) =>
        // Step 1: Remove all characters that are not digits or a decimal point
        // Step 2: Enforce that a decimal point must follow a digit
        onChangeText(
          value.replace(/[^\d.]/g, "").replace(/(^\.)|(\.)(?=.*\.)/g, ""),
        );
      break;
    default:
      keyboardType = "default";
      handleChangeText = onChangeText;
      break;
  }

  return (
    <FormControl isInvalid={isInvalid} isRequired={isRequired} {...props}>
      {labelText && (
        <FormControl.Label>
          <FormControl.Label.Text>{labelText}</FormControl.Label.Text>
        </FormControl.Label>
      )}
      <Input variant="underlined" width="100%">
        <InputField
          keyboardType={keyboardType}
          autoCapitalize="none"
          value={value}
          onChangeText={handleChangeText}
          maxLength={maxLength}
        />
      </Input>
      {errorText && (
        <FormControl.Error>
          <FormControl.Error.Text>{errorText}</FormControl.Error.Text>
        </FormControl.Error>
      )}
    </FormControl>
  );
}
