import { FormControl, Input, InputField } from "@gluestack-ui/themed";

export default function PasswordInput({
  labelText,
  errorText,
  helperText,
  isInvalid = false,
  isRequired = true,
  value,
  onChangeText,
}) {
  return (
    <FormControl isInvalid={isInvalid} isRequired={isRequired}>
      <FormControl.Label>
        <FormControl.Label.Text>{labelText}</FormControl.Label.Text>
      </FormControl.Label>
      <Input variant="underlined" width="100%">
        <InputField
          autoCapitalize="none"
          value={value}
          onChangeText={onChangeText}
          type="password"
        />
      </Input>
      {helperText && (
        <FormControl.Helper>
          <FormControl.Helper.Text>{helperText}</FormControl.Helper.Text>
        </FormControl.Helper>
      )}
      <FormControl.Error>
        <FormControl.Error.Text>{errorText}</FormControl.Error.Text>
      </FormControl.Error>
    </FormControl>
  );
}
