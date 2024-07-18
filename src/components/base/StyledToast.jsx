import {
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
} from "@gluestack-ui/themed";

export default function StyledToast({ id, title, description, action }) {
  const toastId = "toast-" + id;
  return (
    <Toast nativeID={toastId} action={action} variant="solid">
      <VStack space="xs">
        <ToastTitle>{title}</ToastTitle>
        <ToastDescription>{description}</ToastDescription>
      </VStack>
    </Toast>
  );
}
