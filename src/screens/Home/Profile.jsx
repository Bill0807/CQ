import { Box, Image, VStack } from "@gluestack-ui/themed";
import { useState } from "react";
import { useRecoilState } from "recoil";

import DeleteAccountModal from "./DeleteAccountModal";
import { TextButton } from "../../components/base";
import auth from "../../config/firebase/auth";
import store from "../../config/firebase/store";
import { authState } from "../../stores/auth-state";

export default function Profile({ navigation }) {
  const [uid, setUid] = useRecoilState(authState);
  const [showAlert, setShowAlert] = useState(false);

  const handleSignout = async () => {
    await auth.logout();
    setUid(null);
  };

  const handleDeleteAccount = async () => {
    try {
      await store.deleteUser(uid);
      await auth.remove();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      flex={1}
      width="100%"
      justifyContent="center"
      alignItems="center"
      padding={50}
    >
      <Box flex={1} paddingTop={80}>
        <Image
          size="xl"
          borderRadius="$full"
          source={require("../../../assets/icon.png")}
          alt="logo"
        />
      </Box>
      <VStack flex={1} space="3xl" width="100%">
        <TextButton label="Sign Out" onPress={handleSignout} />
        <TextButton label="Delete Account" onPress={() => setShowAlert(true)} />
        <DeleteAccountModal
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          onDeleteAccount={handleDeleteAccount}
        />
      </VStack>
    </Box>
  );
}
