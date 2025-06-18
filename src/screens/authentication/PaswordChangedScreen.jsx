import { Image, StyleSheet, View } from "react-native";
import CustomText from "../../components/Shared/CustomText";
import CustomButton from "../../components/Shared/CustomButton";
import { useTranslation } from "react-i18next";

const PaswordChangedScreen = ({ navigation }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.gif}>
        <Image source={require("../../../assets/inapp/password-changed.gif")} />
      </View>
      <View style={styles.textWrapper}>
        <CustomText style={styles.text}>
          {t("passwordChangedScreen:title")}
        </CustomText>
      </View>
      <CustomButton
        text={t("passwordChangedScreen:button")}
        onClick={() => navigation.popToTop()}
        style={styles.button}
      />
    </View>
  );
};

export default PaswordChangedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    marginTop: 16,
    marginBottom: 40,
  },
  text: {
    fontFamily: "estedad_bold",
    fontSize: 20,
  },
  button: {
    width: "90%",
  },
});
