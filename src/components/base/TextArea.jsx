import { FormControl, TextareaInput, Textarea } from "@gluestack-ui/themed";

export default function TextArea({
  labelText,
  isRequired = true,
  isInvalid = false,
  value,
  onChangeText,
  placeholder,
  width,
}) {
  return (
    <FormControl isInvalid={isInvalid} isRequired={isRequired}>
      <FormControl.Label>
        <FormControl.Label.Text>{labelText}</FormControl.Label.Text>
      </FormControl.Label>
      <Textarea width={width ?? "100%"}>
        <TextareaInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
        />
      </Textarea>
    </FormControl>
  );
}
