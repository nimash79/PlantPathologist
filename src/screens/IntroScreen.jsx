import { StyleSheet, View, Image } from "react-native";
import { useDispatch } from "react-redux";
import Constants from "expo-constants";

import DefaultLayout from "../layouts/DefaultLayout";
import CustomButton from "../components/Shared/CustomButton";
import CustomText from "../components/Shared/CustomText";
import { useEffect, useState } from "react";
import { getUserInfo } from "../services/accountService";
import { addUser } from "../redux/reducers/userReducer";
import { isAuthenticated } from "../utils/authentication";
import { COLORS } from "../utils/constants";
import { useTranslation } from "react-i18next";
import { getLanguage } from "../utils/data_storage";

const IntroScreen = ({ navigation }) => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  useEffect(() => {
    (async () => {
      const canPass = await isAuthenticated();
      if (canPass) {
        try {
          const { data } = await getUserInfo();
          console.log(data);
          if (data.status === 200) {
            dispatch(addUser(data.data));
            navigation.replace("Home");
          }
        } catch (err) {
          console.error(err);
        }
      }
      setLoaded(true);
    })();
  }, []);

  const onSubmit = async () => {
    const lang = await getLanguage();
    if (!lang) navigation.navigate("Language", { prev: "Intro" });
    else navigation.navigate("Authentication");
  }
  if (!loaded) return null;
  return (
    <DefaultLayout intro={true}>
      <Image
        source={require("../../assets/inapp/auth_background.png")}
        style={styles.background}
      />
      <View style={styles.container}>
        <CustomText style={styles.welcome}>{t("common:welcome")}</CustomText>
        <Image
          source={require("../../assets/inapp/intro.png")}
          style={styles.image}
        />
        <CustomText
          style={
            i18n.language === "fa"
              ? [styles.description, { letterSpacing: 7 }]
              : styles.description
          }
        >
          <CustomText style={styles.bold}>{t("common:app_name")}</CustomText>{" "}
          {t("introScreen:text")}
        </CustomText>
        <CustomButton
          style={styles.button}
          text={t("common:continue")}
          onClick={onSubmit}
        />
      </View>
    </DefaultLayout>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.tint1,
    paddingHorizontal: "5%",
  },
  background: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  welcome: {
    fontFamily: "estedad_bold",
    fontSize: 24,
    color: COLORS.black,
    textAlign: "center",
    marginTop: 32,
  },
  image: {
    width: 318,
    height: 318,
    marginTop: 32,
  },
  description: {
    fontFamily: "estedad",
    fontSize: 14,
    color: COLORS.shade2,
    textAlign: "justify",
    // letterSpacing: 7,
    marginTop: 32,
  },
  bold: {
    fontFamily: "estedad_bold",
  },
});
