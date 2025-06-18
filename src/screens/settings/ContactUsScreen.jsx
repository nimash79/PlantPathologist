import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Constants from "expo-constants";

import { COLORS } from "../../utils/constants";
import BackIcon from "../../components/Icons/BackIcon";
import CustomText from "../../components/Shared/CustomText";
import PhoneIcon from "../../components/Icons/PhoneIconl";
import EmailSmallIcon from "../../components/Icons/EmailSmallIcon";
import { useTranslation } from "react-i18next";

const ContactUsScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <View style={styles.backIcon}>
            <BackIcon />
          </View>
        </TouchableWithoutFeedback>
        <CustomText style={styles.headerText}>
          {t("contactUsScreen:title")}
        </CustomText>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CustomText style={[styles.description, { marginTop: 32 }]}>
          {t("contactUsScreen:description")}
        </CustomText>
        <CustomText style={styles.title}>
          {t("contactUsScreen:contact_us")}
        </CustomText>
        <View style={styles.contactDetails}>
          <View style={styles.contactDetail}>
            <PhoneIcon />
            <CustomText style={styles.contactDetailLabel}>
              {t("contactUsScreen:phone_number")}
            </CustomText>
            <CustomText style={styles.contactDetailValue}>
              +۹۸ ۹۱۷ ۳۹۱ ۱۶۲۵
            </CustomText>
          </View>
          <View style={styles.contactDetail}>
            <EmailSmallIcon />
            <CustomText style={styles.contactDetailLabel}>{t("contactUsScreen:email")}</CustomText>
            <CustomText style={styles.contactDetailValue}>
              plantpathologist@gmail.com
            </CustomText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ContactUsScreen;

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
  title: {
    fontFamily: "estedad_semibold",
    fontSize: 16,
    color: COLORS.neutral_60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral_ed,
    width: 160,
    marginBottom: 16,
  },
  description: {
    fontFamily: "estedad",
    fontSize: 12,
    color: COLORS.neutral_60,
    textAlign: "justify",
    lineHeight: 24,
    marginBottom: 24,
  },
  contactDetails: {
    marginBottom: 16,
  },
  contactDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  contactDetailLabel: {
    fontFamily: "estedad",
    fontSize: 12,
    color: COLORS.neutral_40,
    marginLeft: 8,
  },
  contactDetailValue: {
    fontFamily: "estedad",
    fontSize: 12,
    color: COLORS.neutral_86,
    marginLeft: 4,
  },
  textArea: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.neutral_df,
    fontFamily: "peyda_semibold",
    fontSize: 16,
    padding: 16,
    textAlignVertical: "top",
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    marginBottom: 32,
  },
  sendButtonText: {
    fontSize: 14,
    color: COLORS.neutral_f9,
  },
});
