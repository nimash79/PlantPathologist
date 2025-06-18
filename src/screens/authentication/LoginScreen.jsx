import {
  Image,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { CommonActions } from "@react-navigation/native";
import { useDispatch } from "react-redux";

import DefaultLayout from "../../layouts/DefaultLayout";
import CustomInput from "../../components/Shared/CustomInput";
import UserIcon from "../../components/Icons/UserIcon";
import LockIcon from "../../components/Icons/LockIcon";
import CustomText from "../../components/Shared/CustomText";
import CustomButton from "../../components/Shared/CustomButton";
import CustomLink from "../../components/Shared/CustomLink";
import CustomPasswordInput from "../../components/Shared/CustomPasswordInput";
import LoadingModal from "../../components/modals/LoadingModal";
import {
  addRefreshToken,
  addToken,
  removeToken,
} from "../../utils/data_storage";
import { getUserInfo, login } from "../../services/accountService";
import { addUser, removeUser } from "../../redux/reducers/userReducer";
import ErrorAlert from "./../../components/alerts/ErrorAlert";
import { useTranslation } from "react-i18next";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState();

  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      await removeToken();
    })();
  }, []);

  useEffect(() => {
    let timeout;
    if (error) {
      timeout = setTimeout(() => {
        setError(false);
      }, 3000);
    } else clearTimeout(timeout);
  }, [error]);

  const submit = async () => {
    try {
      setModalVisible(true);
      const loginRes = await login({
        username: username.toLowerCase(),
        password,
      });
      console.log("loginRes:", loginRes);
      console.log(loginRes.data);
      console.log(loginRes.data.status);
      if (loginRes.data.status === 401) {
        setModalVisible(false);
        setErrorText(t("loginScreen:error_login"));
        setError(true);
        return;
      }
      if (loginRes.data.data.is_admin) {
        setErrorText(t("loginScreen:admin_not_allowed"));
        setError(true);
        setModalVisible(false);
        return;
      }
      await addToken(loginRes.data.data.access);
      await addRefreshToken(loginRes.data.data.refresh);
      const { data } = await getUserInfo();
      console.log(data);
      if (data.status === 401) {
        setModalVisible(false);
        setErrorText(t("loginScreen:error_login"));
        setError(true);
        return;
      }
      dispatch(removeUser());
      dispatch(addUser(data.data));
      const action = CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
      navigation.dispatch(action);
      setModalVisible(false);
    } catch (err) {
      setModalVisible(false);
      if (err.status === 401) {
        setModalVisible(false);
        setErrorText(t("loginScreen:error_login"));
        setError(true);
        return;
      }
      setErrorText(t("common:error_server"));
      setError(true);
    }
  };
  return (
    <DefaultLayout>
      <LoadingModal text={t("loginScreen:loggingIn")} visible={modalVisible} />
      <ErrorAlert
        visible={error}
        setVisible={setError}
        text={errorText}
        style={{ width: "90%", alignSelf: "center" }}
      />
      <Image
        source={require("../../../assets/inapp/login.png")}
        style={styles.loginImage}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <CustomText style={styles.header}>{t("loginScreen:title")}</CustomText>
        <CustomInput
          placeholder={t("loginScreen:firstInput")}
          icon={<UserIcon />}
          onChangeText={setUsername}
        />
        <CustomPasswordInput
          placeholder={t("loginScreen:secondInput")}
          icon={<LockIcon />}
          onChangeText={setPassword}
          align="right"
        />
        {/* <View style={styles.checkBoxContainer}>
          <CustomCheckbox value={rememberMe} onValueChange={setRememberMe} />
          <CustomText style={styles.checkBoxText}>
            من را به خاطر بسپار
          </CustomText>
        </View> */}
        <CustomLink
          style={{ fontSize: 10, fontStyle: "estedad" }}
          withoutUnderlay={true}
          onClick={() => navigation.navigate("ForgotPassword")}
        >
          {t("loginScreen:forgotPassword")}
        </CustomLink>
        <CustomButton
          text={t("loginScreen:login")}
          style={styles.button}
          onClick={submit}
        />
        <View style={styles.guide}>
          <CustomText
            style={{ fontFamily: "estedad_bold", fontSize: 10, marginRight: 8 }}
          >
            {t("loginScreen:registerQuestion")}
          </CustomText>
          <CustomLink
            fontStyle="bold"
            style={{ fontSize: 10 }}
            onClick={() => navigation.replace("Register")}
          >
            {t("loginScreen:register")}
          </CustomLink>
        </View>
      </View>
    </DefaultLayout>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  content: {
    marginTop: 32,
    width: "90%",
    alignSelf: "center",
  },
  loginImage: {
    width: "100%",
    height: 0.25 * Dimensions.get("window").height,
  },
  header: {
    fontFamily: "estedad_bold",
    fontSize: 20,
    marginBottom: 30,
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
    marginTop: 16,
    marginBottom: 16,
  },
  guide: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
