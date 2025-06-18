import { StyleSheet, TextInput, View } from "react-native";
import { useRef, useState } from "react";

import ForgotLayout from "../../layouts/ForgotLayout";
import CustomButton from "../../components/Shared/CustomButton";
import CustomText from "../../components/Shared/CustomText";
import CustomLink from "../../components/Shared/CustomLink";
import { errorAlert } from "../../utils/alert";
import { checkPasswordRecovery, passwordRecovery } from "../../services/accountService";
import LoadingModal from "../../components/modals/LoadingModal";
import { COLORS } from "../../utils/constants";
import { useTranslation } from "react-i18next";

const ResendCodeScreen = ({ navigation, route }) => {
  const [disabled, setDisabled] = useState(true);
  const [visible, setVisible] = useState(false);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [input4, setInput4] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [focusInput, setFocusInput] = useState();

  const {email} = route.params;

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  const {t} = useTranslation();

  const resend = async () => {
    try {
      const {data} = await passwordRecovery({ email });
      console.log(data);
      if (data.status == 200) setSendEmail(true);
      else if (data.status === 404) errorAlert(t("resendCodeScreen:notFound"), st("resendCodeScreen:error_email"))
    } catch (err) {
      console.log(err);
      errorAlert("", t("common:error_server"));
    }
  }

  const submit = async () => {
    try {
      setVisible(true);
      const {data} = await checkPasswordRecovery({digit: `${input1}${input2}${input3}${input4}`});
      console.log({digit: `${input1}${input2}${input3}${input4}`});
      console.log(data);
      if (data.status == 200) navigation.navigate("ResetPassword");
      else if (data.status == 404) errorAlert(t("resendCodeScreen:invalid"), t("resendCodeScreen:error"));
    } catch (err) {
      console.log(err);
      errorAlert("", t("common:error_server"));
    }
    setVisible(false);
  };
  return (
    <ForgotLayout
      navigation={navigation}
      sendEmail={sendEmail}
      setSendEmail={setSendEmail}
    >
      <LoadingModal text={t("resendCodeScreen:verifying")} visible={visible} /> 
      <CustomText style={{ fontFamily: "estedad_bold", marginBottom: 30, fontSize: 20 }}>
        {t("resendCodeScreen:title")}
      </CustomText>
      <CustomText style={styles.guide}>
      {t("resendCodeScreen:description")}
      </CustomText>
      <View style={styles.inputs}>
        <TextInput
          ref={ref1}
          style={
            focusInput === 1 ? [styles.input, styles.activeInput] : styles.input
          }
          keyboardType="numeric"
          maxLength={1}
          cursorColor={COLORS.primary}
          onChangeText={(value) => {
            setInput1(value);
            if (value.length === 1) ref2.current.focus();
          }}
          onFocus={() => setFocusInput(1)}
        />
        <TextInput
          ref={ref2}
          style={
            focusInput === 2 ? [styles.input, styles.activeInput] : styles.input
          }
          keyboardType="numeric"
          maxLength={1}
          cursorColor={COLORS.primary}
          onChangeText={(value) => {
            setInput2(value);
            if (value.length === 1) ref3.current.focus();
            else ref1.current.focus();
          }}
          onFocus={() => setFocusInput(2)}
        />
        <TextInput
          ref={ref3}
          style={
            focusInput === 3 ? [styles.input, styles.activeInput] : styles.input
          }
          keyboardType="numeric"
          cursorColor={COLORS.primary}
          maxLength={1}
          onChangeText={(value) => {
            setInput3(value);
            if (value.length === 1) ref4.current.focus();
            else ref2.current.focus();
          }}
          onFocus={() => setFocusInput(3)}
        />
        <TextInput
          ref={ref4}
          style={
            focusInput === 4 ? [styles.input, styles.activeInput] : styles.input
          }
          keyboardType="numeric"
          cursorColor={COLORS.primary}
          maxLength={1}
          onChangeText={(value) => {
            setInput4(value);
            if (value.length === 1) setDisabled(false);
            else {
              setDisabled(true);
              ref3.current.focus();
            }
          }}
          onFocus={() => setFocusInput(4)}
        />
      </View>
      <CustomButton
        text={t("resendCodeScreen:button")}
        disabled={disabled}
        onClick={submit}
      />
      <View style={styles.guideLink}>
        <CustomText style={{ fontFamily: "estedad_bold", fontSize: 12, marginRight: 8 }}>
        {t("resendCodeScreen:resendCodeQuestion")}
        </CustomText>
        <CustomLink
          style={{ fontFamily: "estedad_bold", fontSize: 12 }}
          withoutUnderlay
          onClick={resend}
        >
          {t("resendCodeScreen:resendCode")}
        </CustomLink>
      </View>
    </ForgotLayout>
  );
};

export default ResendCodeScreen;

const styles = StyleSheet.create({
  guide: {
    fontFamily: "estedad",
    fontSize: 14,
    color: "#404040",
    marginBottom: 32,
  },
  disabled: {
    backgroundColor: "#D7D0FF",
  },
  guideLink: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  inputs: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    marginBottom: 32,
    width: "90%",
    alignSelf: "center",
  },
  input: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBCBCB",
    textAlign: "center",
    fontSize: 16,
  },
  activeInput: {
    borderColor: COLORS.primary,
  },
});
