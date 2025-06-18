import { StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";

import ForgotLayout from "../../layouts/ForgotLayout";
import CustomButton from "../../components/Shared/CustomButton";
import CustomText from "../../components/Shared/CustomText";
import CustomInput from "../../components/Shared/CustomInput";
import { errorAlert } from "../../utils/alert";
import { passwordRecovery } from "../../services/accountService";
import LoadingModal from "../../components/modals/LoadingModal";
import { useTranslation } from "react-i18next";

const ForgotPasswordScreen = ({ navigation }) => {
  const [disabled, setDisabled] = useState(true);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (email.length) setDisabled(false);
    else setDisabled(true);
  }, [email]);
  const submit = async () => {
    try {
      setVisible(true);
      const { data } = await passwordRecovery({ email: email.toLowerCase() });
      console.log(data);
      if (data.status == 200) navigation.navigate("ResendCode", { email: email.toLowerCase() });
      else if (data.status === 404)
        errorAlert(
          t("forgotPasswordScreen:notFound"),
          t("forgotPasswordScreen:error")
        );
    } catch (err) {
      console.log(err);
      errorAlert();
    }
    setVisible(false);
  };
  return (
    <ForgotLayout navigation={navigation}>
      <LoadingModal
        text={t("forgotPasswordScreen:sending")}
        visible={visible}
      />
      <CustomText
        style={{
          fontFamily: "estedad_bold",
          marginBottom: 30,
          fontSize: i18n.language === "en" ? 18 : 20,
        }}
      >
        {t("forgotPasswordScreen:title")}
      </CustomText>
      <CustomText style={styles.guide}>
        {t("forgotPasswordScreen:description")}
      </CustomText>
      <CustomInput
        placeholder={t("forgotPasswordScreen:input")}
        containerStyle={{ marginBottom: 32 }}
        // inputStyle={{paddingHorizontal: 8}}
        onChangeText={setEmail}
      />
      <CustomButton
        text={t("forgotPasswordScreen:button")}
        disabled={disabled}
        onClick={submit}
      />
    </ForgotLayout>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  guide: {
    fontFamily: "estedad",
    fontSize: 14,
    color: "#404040",
    marginBottom: 32,
  },
});
