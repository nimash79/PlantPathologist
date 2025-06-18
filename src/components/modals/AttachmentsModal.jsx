import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

import CustomText from "../Shared/CustomText";
import { COLORS } from "../../utils/constants";
import CameraIcon from "./../Icons/CameraIcon";
import GalleryIcon from "./../Icons/GalleryIcon";
import FileIcon from "./../Icons/FileIcon";
import ContactIcon from "./../Icons/ContactIcon";
import LocationIcon from "./../Icons/LocationIcon";
import { useTranslation } from "react-i18next";

const AttachmentsModal = ({ visible, setVisible, setImage, setDocument }) => {
  const {t}  = useTranslation();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setVisible(false);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      // Create a short file name
      const timestamp = Date.now();
      const extension = asset.uri.split(".").pop(); // try to guess extension
      const shortFileName = `photo_${timestamp}.${extension}`;

      const newAsset = {
        ...asset,
        fileName: shortFileName,
      };

      setImage(newAsset);
      setVisible(false);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync();
    if (!result.canceled) {
      setDocument(result.assets[0]);
      setVisible(false);
    }
  };
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <BlurView
        intensity={100}
        tint="systemChromeMaterialDark"
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <View style={styles.buttons}>
            <TouchableWithoutFeedback onPress={takePhoto}>
              <View style={styles.button}>
                <View style={styles.iconContainer}>
                  <CameraIcon />
                </View>
                <CustomText fontStyle="semibold" style={styles.buttonText}>
                  {t("attachmentsModal:camera")}
                </CustomText>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={pickImage}>
              <View style={styles.button}>
                <View style={styles.iconContainer}>
                  <GalleryIcon />
                </View>
                <CustomText fontStyle="semibold" style={styles.buttonText}>
                  {t("attachmentsModal:gallery")}
                </CustomText>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={pickDocument}>
              <View style={styles.button}>
                <View style={styles.iconContainer}>
                  <FileIcon />
                </View>
                <CustomText fontStyle="semibold" style={styles.buttonText}>
                  {t("attachmentsModal:file")}
                </CustomText>
              </View>
            </TouchableWithoutFeedback>
            {/* <TouchableWithoutFeedback onPress={pickImage}>
              <View style={styles.button}>
                <View style={styles.iconContainer}>
                  <LocationIcon />
                </View>
                <CustomText fontStyle="semibold" style={styles.buttonText}>
                  موقعیت مکانی
                </CustomText>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={pickImage}>
              <View style={styles.button}>
                <View style={styles.iconContainer}>
                  <ContactIcon />
                </View>
                <CustomText fontStyle="semibold" style={styles.buttonText}>
                  مخاطب
                </CustomText>
              </View>
            </TouchableWithoutFeedback> */}
          </View>
          <View style={[styles.buttons, styles.cancelButton]}>
            <TouchableWithoutFeedback onPress={() => setVisible(false)}>
              <View style={styles.button}>
                <CustomText
                  style={[styles.buttonText, styles.cancelButtonText]}
                >
                  {t("attachmentsModal:cancel")}
                </CustomText>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default AttachmentsModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalView: {
    width: "90%",
    margin: 20,
  },
  buttons: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 57,
    borderBottomWidth: 0.33,
    borderBottomColor: "#C6C6C8",
  },
  iconContainer: {
    width: 21,
    height: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "estedad",
    fontSize: 16,
    color: COLORS.neutral_20,
    marginLeft: 16,
  },
  cancelButton: {
    marginTop: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: COLORS.primary,
  },
});
