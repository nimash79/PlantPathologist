import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";

import ForgotLayout from "../../layouts/ForgotLayout";
import CustomButton from "../../components/Shared/CustomButton";
import CustomText from "../../components/Shared/CustomText";
import CustomPasswordInput from "../../components/Shared/CustomPasswordInput";
import { changePassword } from "../../services/accountService";
import { errorAlert } from "../../utils/alert";
import LoadingModal from "../../components/modals/LoadingModal";
import { useTranslation } from "react-i18next";

const ResetPasswordScreen = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { t } = useTranslation();

  useEffect(() => {
    if (password.length && confirmPassword.length) setDisabled(false);
    else setDisabled(true);
  }, [password, confirmPassword]);

  const submit = async () => {
    try {
      setVisible(true);
      const { data } = await changePassword({
        new_password: password,
        confirm_password: confirmPassword,
      });
      console.log(data);
      if (data.status == 200) navigation.navigate("PasswordChanged");
    } catch (err) {
      console.error(err);
      errorAlert("", t("common:error_server"));
    }
    setVisible(false);
  };
  return (
    <ForgotLayout navigation={navigation}>
      <LoadingModal text={t("resetPasswordScreen:saving")} visible={visible} />
      <CustomText
        style={{ fontFamily: "estedad_bold", marginBottom: 30, fontSize: 20 }}
      >
        {t("resetPasswordScreen:title")}
      </CustomText>
      <CustomText style={styles.guide}>
        {t("resetPasswordScreen:description")}
      </CustomText>
      <CustomPasswordInput
        containerStyle={{ marginBottom: 24 }}
        placeholder={t("resetPasswordScreen:input_1")}
        onChangeText={setPassword}
      />
      <CustomPasswordInput
        containerStyle={{ marginBottom: 24 }}
        placeholder={t("resetPasswordScreen:input_2")}
        onChangeText={setConfirmPassword}
      />
      <CustomButton
        text={t("resetPasswordScreen:button")}
        // disabled={disabled}
        // onClick={submit}
        onClick={() => navigation.navigate("PasswordChanged")}
      />
    </ForgotLayout>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  guide: {
    fontFamily: "estedad",
    fontSize: 14,
    color: "#404040",
    marginBottom: 32,
  },
});
