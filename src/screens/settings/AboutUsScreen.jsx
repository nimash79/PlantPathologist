import { ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Constants from "expo-constants";

import { COLORS } from "../../utils/constants";
import BackIcon from "../../components/Icons/BackIcon";
import CustomText from "../../components/Shared/CustomText";
import { useTranslation } from "react-i18next";

const AboutUsScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <View style={styles.backIcon}>
            <BackIcon />
          </View>
        </TouchableWithoutFeedback>
        <CustomText style={styles.headerText}>{t("aboutUsScreen:title")}</CustomText>
      </View>
      <View style={styles.mainParagraph}>
        <View style={{ flexDirection: "row" }}>
          <CustomText style={[styles.bold, { color: COLORS.primary }]}>
            {t("common:app_name")}
          </CustomText>
          <CustomText style={styles.text}>
            {t("aboutUsScreen:subtitle")}
          </CustomText>
        </View>
        <CustomText style={styles.text}>
          {t("aboutUsScreen:description")}
        </CustomText>
      </View>
      <CustomText style={styles.paragraphTitle}>{t("aboutUsScreen:our_services")}</CustomText>
      <CustomText style={styles.text}>
        <CustomText style={styles.bold}>{t("aboutUsScreen:identifying_plant_problems_title")}:</CustomText>{" "}
        {t("aboutUsScreen:identifying_plant_problems_desc")}
      </CustomText>
      <CustomText style={styles.text}>
        <CustomText style={styles.bold}>{t("aboutUsScreen:online_consultation_title")}:</CustomText>{" "}
        {t("aboutUsScreen:online_consultation_desc")}
      </CustomText>
      <CustomText style={styles.paragraphTitle}>{t("aboutUsScreen:our_goals_title")}</CustomText>
      <CustomText style={styles.text}>
        {t("aboutUsScreen:our_goals_desc")}
      </CustomText>
    </ScrollView>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF7FF",
    paddingHorizontal: "5%",
    marginTop: Constants.statusBarHeight,
  },
  header: {
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    position: "absolute",
    left: 0,
  },
  headerText: {
    fontFamily: "estedad_bold",
    fontSize: 20,
    color: COLORS.neutral_40,
  },
  mainParagraph: {
    marginTop: 32,
  },
  bold: {
    fontFamily: "estedad_bold",
    fontSize: 12,
    color: COLORS.neutral_60,
    lineHeight: 26,
  },
  text: {
    fontFamily: "estedad",
    fontSize: 12,
    color: COLORS.neutral_60,
    lineHeight: 26,
    textAlign: "justify",
  },
  paragraphTitle: {
    fontFamily: "estedad_semibold",
    fontSize: 14,
    color: COLORS.neutral_60,
    marginBottom: 8,
    marginTop: 16,
  },
});
