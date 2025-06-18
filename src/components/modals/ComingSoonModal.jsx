import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { BlurView } from "expo-blur";

import CloseIcon from "./../Icons/CloseIcon";
import CustomText from "../Shared/CustomText";
import { COLORS } from "../../utils/constants";
import CustomButton from './../Shared/CustomButton';
import { useTranslation } from "react-i18next";

const ComingSoonModal = ({ visible, setVisible }) => {
  const {t} = useTranslation();
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <BlurView
        intensity={100}
        tint="systemChromeMaterialDark"
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <TouchableWithoutFeedback onPress={() => setVisible(false)}>
            <CloseIcon width={24} height={24} style={styles.closeIcon} />
          </TouchableWithoutFeedback>
          <Image
            source={require("../../../assets/inapp/coming_soon.png")}
            style={styles.img}
          />
          <CustomText style={styles.text}>{t("common:coming_soon")}</CustomText>
          <CustomButton style={styles.button} text={t("common:ok")} onClick={() => setVisible(false)} />
        </View>
      </BlurView>
    </Modal>
  );
};

export default ComingSoonModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    width: "80%",
    margin: 20,
    borderRadius: 8,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeIcon: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  img: {
    width: 190,
    height: 82,
  },
  text: {
    fontFamily: "estedad_semibold",
    fontSize: 14,
    color: COLORS.shade1,
    marginVertical: 24,
  }
});
