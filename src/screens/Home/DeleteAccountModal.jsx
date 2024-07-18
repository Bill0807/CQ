import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  ButtonGroup,
  ButtonSpinner,
  ButtonText,
  CloseIcon,
  Heading,
  Icon,
  Text,
} from "@gluestack-ui/themed";
import { useState } from "react";

export default function DeleteAccountModal({
  showAlert,
  setShowAlert,
  onDeleteAccount,
}) {
  const [isLoading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onDeleteAccount();
      setShowAlert(false);
    } catch (error) {
      console.error("There was an error deleting account: ", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AlertDialog isOpen={showAlert} onClose={() => setShowAlert(false)}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading size="md">Delete account</Heading>
          <AlertDialogCloseButton>
            <Icon as={CloseIcon} />
          </AlertDialogCloseButton>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text>
            Are you sure you want to delete your account? Your data will be
            permanently removed and cannot be undone.
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <ButtonGroup space="lg" isDisabled={isLoading}>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setShowAlert(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button bg="$error600" action="negative" onPress={handleDelete}>
              {isLoading && <ButtonSpinner mr="$1" />}
              <ButtonText>Delete</ButtonText>
            </Button>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
