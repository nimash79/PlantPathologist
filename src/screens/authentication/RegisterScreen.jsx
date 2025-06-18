import { StyleSheet, View, Dimensions, Image } from "react-native";
import { CommonActions } from "@react-navigation/native";

import DefaultLayout from "../../layouts/DefaultLayout";
import CustomInput from "../../components/Shared/CustomInput";
import UserIcon from "../../components/Icons/UserIcon";
import EmailIcon from "../../components/Icons/EmailIcon";
import UserBorderedIcon from "../../components/Icons/UserBorderedIcon";
import KeyIcon from "../../components/Icons/KeyIcon";
import LockIcon from "../../components/Icons/LockIcon";
import GiftIcon from "../../components/Icons/GiftIcon";
import CustomText from "../../components/Shared/CustomText";
import CustomButton from "../../components/Shared/CustomButton";
import CustomLink from "../../components/Shared/CustomLink";
import { useEffect, useState } from "react";
import { getUserInfo, register } from "../../services/accountService";
import { errorAlert } from "../../utils/alert";
import CustomPasswordInput from "../../components/Shared/CustomPasswordInput";
import LoadingModal from "../../components/modals/LoadingModal";
import ErrorAlert from "../../components/alerts/ErrorAlert";
import { addRefreshToken, addToken } from "../../utils/data_storage";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../../redux/reducers/userReducer";
import PhoneIcon from "./../../components/Icons/PhoneIconl";
import MobileIcon from "./../../components/Icons/MobileIcon";
import { useTranslation } from "react-i18next";

const RegisterScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState();

  const dispatch = useDispatch();
  const {t} = useTranslation();

  useEffect(() => {
    let timeout;
    if (error) {
      timeout = setTimeout(() => {
        setError(false);
      }, 3000);
    } else clearTimeout(timeout);
  }, [error]);

  const submit = async () => {
    // form validation
    if (!fullName.length) {
      setErrorText(t("registerScreen:error_fullname"));
      setError(true);
      return;
    } else if (!email.length) {
      setErrorText(t("registerScreen:error_email"));
      setError(true);
      return;
    } else if (!mobile.length) {
      setErrorText(t("registerScreen:error_mobile"));
      setError(true);
      return;
    } else if (!password.length) {
      setErrorText(t("registerScreen:error_password"));
      setError(true);
      return;
    } else if (!confirmPassword.length) {
      setErrorText(t("registerScreen:error_confirmPassword"));
      setError(true);
      return;
    }
    if (password !== confirmPassword) {
      setErrorText(t("registerScreen:error_conflict"));
      setError(true);
      return;
    }
    try {
      setModalVisible(true);
      const response = await register({
        fullName,
        mobile,
        username: email.toLowerCase(),
        email: email.toLocaleLowerCase(),
        password,
      });
      console.log(response.data);
      if (response.data.status === 201) {
        await addToken(response.data.data.access);
        await addRefreshToken(response.data.data.refresh);
        dispatch(removeUser());
        const userRes = await getUserInfo();
        dispatch(addUser(userRes.data.data));
        const action = CommonActions.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
        navigation.dispatch(action);
      }
      setModalVisible(false);
    } catch (err) {
      setModalVisible(false);
      console.log(err);
      setErrorText(t("common:error_server"));
      setError(true);
    }
  };
  return (
    <DefaultLayout>
      <LoadingModal text={t("registerScreen:registering")} visible={modalVisible} />
      <ErrorAlert
        visible={error}
        setVisible={setError}
        text={errorText}
        style={{ width: "90%", alignSelf: "center" }}
      />
      <Image
        source={require("../../../assets/inapp/register.png")}
        style={styles.registerImage}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <CustomText style={styles.header}>{t("registerScreen:title")}</CustomText>
        <CustomInput
          placeholder={t("registerScreen:input_1")}
          icon={<UserIcon />}
          onChangeText={setFullName}
        />
        <CustomInput
          placeholder={t("registerScreen:input_2")}
          icon={<EmailIcon />}
          onChangeText={setEmail}
        />
        <CustomInput
          placeholder={t("registerScreen:input_3")}
          icon={<MobileIcon />}
          onChangeText={setMobile}
        />
        <CustomPasswordInput
          placeholder={t("registerScreen:input_4")}
          icon={<KeyIcon />}
          onChangeText={setPassword}
          align="right"
        />
        <CustomPasswordInput
          placeholder={t("registerScreen:input_5")}
          icon={<LockIcon />}
          onChangeText={setConfirmPassword}
          align="right"
        />
        <CustomButton
          text={t("registerScreen:register")}
          style={styles.button}
          onClick={submit}
        />
        <View style={styles.guide}>
          <CustomText
            style={{ fontFamily: "estedad_bold", fontSize: 10, marginRight: 8 }}
          >
            {t("registerScreen:loginQuestion")}
          </CustomText>
          <CustomLink
            style={{ fontSize: 10 }}
            onClick={() => navigation.replace("Login")}
          >
            {t("registerScreen:login")}
          </CustomLink>
        </View>
      </View>
    </DefaultLayout>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  content: {
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#F3F6FB",
  },
  registerImage: {
    width: "100%",
    height: 0.25 * Dimensions.get("window").height,
  },
  header: {
    fontFamily: "estedad_bold",
    fontSize: 20,
    marginBottom: 16,
  },
  checkBoxContainer: {
    flexDirection: "row",
  },
  checkBoxText: {
    color: "#606060",
    fontSize: 10,
    marginLeft: 8,
  },
  button: {
    marginVertical: 8,
  },
  guide: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
});
