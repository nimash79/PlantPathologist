import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  I18nManager,
} from "react-native";
import * as Updates from "expo-updates";
import { CommonActions } from "@react-navigation/native";

import DefaultLayout from "../layouts/DefaultLayout";
import CustomButton from "../components/Shared/CustomButton";
import CustomText from "../components/Shared/CustomText";
import { useEffect, useState } from "react";
import { COLORS } from "../utils/constants";
import ArrowDown from "../components/Icons/ArrowDown";
import ArrowLeft from "../components/Icons/ArrowLeft";
import ArrowRight from "../components/Icons/ArrowRight";
import { useTranslation } from "react-i18next";
import {
  addLanguage,
  getLanguage,
  removeLanguage,
} from "../utils/data_storage";

const LanguageScreen = ({ navigation, route }) => {
  const [pageIsReady, setPageIsReady] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [lang, changeLang] = useState("en");
  const { t, i18n } = useTranslation();
  const languages = [
    { code: "en", label: t("common:en") },
    { code: "fa", label: t("common:fa") },
    { code: "ar", label: t("common:ar") },
  ];

  useEffect(() => {
    console.log(route.params);
    (async () => {
      const language = await getLanguage();
      if (language) changeLang(language);
      setPageIsReady(true);
    })();
  }, []);

  const submit = async () => {
    console.log("submit: ", lang);
    i18n.changeLanguage(lang);
    I18nManager.forceRTL(lang !== "en");
    await addLanguage(lang);
    const action = CommonActions.reset({
      index: 0,
      routes: [
        { name: route.params?.prev === "Intro" ? "Authentication" : "Home" },
      ],
    });
    await navigation.dispatch(action);
    await Updates.reloadAsync();
  };

  if (!pageIsReady) return null;

  return (
    <DefaultLayout intro={true}>
      <View style={styles.container}>
        <CustomText style={styles.welcome}>
          {route.params?.prev === "Intro"
            ? t("common:welcome")
            : t("languageScreen:title")}
        </CustomText>
        <View style={styles.languageContainer}>
          <CustomText style={styles.title}>
            {t("languageScreen:choose_language_guide")}
          </CustomText>
          <View style={styles.dropdown}>
            <TouchableWithoutFeedback onPress={() => setShowItems((x) => !x)}>
              <View style={styles.input}>
                <CustomText style={styles.inputText}>
                  {t("languageScreen:choose_language")}
                </CustomText>
                {showItems ? (
                  <ArrowDown style={styles.arrowDown} />
                ) : i18n.language == "en" ? (
                  <ArrowRight style={styles.arrowLeft} />
                ) : (
                  <ArrowLeft style={styles.arrowLeft} />
                )}
              </View>
            </TouchableWithoutFeedback>
            <View
              style={showItems ? styles.items : [styles.items, { opacity: 0 }]}
            >
              {languages.map((language) => (
                <TouchableWithoutFeedback
                  key={language.code}
                  onPress={() => changeLang(language.code)}
                >
                  <View>
                    <CustomText
                      style={
                        lang === language.code
                          ? [styles.item, styles.selectedItem]
                          : [styles.item]
                      }
                    >
                      {language.label}
                    </CustomText>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </View>
          </View>
          <CustomButton text={t("common:submit")} onClick={submit} />
        </View>
      </View>
    </DefaultLayout>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.tint1,
  },
  welcome: {
    fontFamily: "estedad_bold",
    fontSize: 24,
    color: COLORS.black,
    textAlign: "center",
    marginTop: 32,
  },
  languageContainer: {
    marginTop: 34,
    backgroundColor: COLORS.neutral_f9,
    borderTopStartRadius: 32,
    borderTopEndRadius: 32,
    paddingHorizontal: "5%",
    flex: 1,
  },
  title: {
    fontFamily: "estedad",
    fontSize: 20,
    color: COLORS.black,
    marginTop: 34,
    textAlign: "center",
  },
  dropdown: {
    marginTop: 34,
    marginBottom: 72,
  },
  input: {
    backgroundColor: COLORS.tint1,
    borderRadius: 8,
    paddingVertical: 12,
  },
  inputText: {
    fontFamily: "estedad",
    fontSize: 16,
    textAlign: "center",
  },
  arrowDown: {
    position: "absolute",
    right: "5%",
    top: "75%",
  },
  arrowLeft: {
    position: "absolute",
    right: "5%",
    top: "60%",
  },
  items: {
    backgroundColor: COLORS.tint4,
    marginTop: 8,
    borderRadius: 8,
  },
  item: {
    textAlign: "center",
    paddingVertical: 8,
    fontFamily: "estedad_semibold",
    fontSize: 16,
    color: COLORS.neutral_86,
  },
  selectedItem: {
    backgroundColor: COLORS.tint3,
    color: COLORS.neutral_40,
  },
});
