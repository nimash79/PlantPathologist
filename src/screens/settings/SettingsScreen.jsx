import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Switch } from "react-native-switch";

import BackIcon from "../../components/Icons/BackIcon";
import Constants from "expo-constants";
import CustomText from "../../components/Shared/CustomText";
import { COLORS } from "../../utils/constants";
import ArrowLeftIcon from "../../components/Icons/ArrowLeft";
import PersonalInformationIcon from "../../components/Icons/ProfileIcons/PersonalInformationIcon";
import CalendarIcon from "../../components/Icons/ProfileIcons/CalendarIcon";
import ClockIcon from "../../components/Icons/ProfileIcons/ClockIcon";
import { useEffect, useState } from "react";
import FaqIcon from "../../components/Icons/ProfileIcons/FaqIcon";
import AboutUsIcon from "../../components/Icons/ProfileIcons/AboutUsIcon";
import ContactUsIcon from "../../components/Icons/ProfileIcons/ContactUsIcon";
import LogoutIcon from "../../components/Icons/ProfileIcons/LogoutIcon";
import LogoutModal from "../../components/modals/LogoutModal";
import ReminderModal from "../../components/modals/ReminderModal";
import { e2p, twoDigit } from "../../utils/convertors";
import { updateUser } from "../../services/accountService";
import ComingSoonModal from "../../components/modals/ComingSoonModal";
import { useTranslation } from "react-i18next";
import LanguageIcon from './../../components/Icons/LanguageIcon';

const SettingsScreen = ({ navigation }) => {
  const [reminder, setReminder] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [reminderModal, setReminderModal] = useState(false);
  const [reminderHour, setReminderHour] = useState(0);
  const [reminderMinute, setReminderMinute] = useState(0);
  const [reminderUpdated, setReminderUpdated] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);

  const {t, i18n} = useTranslation();

  useEffect(() => {
    setReminder(false);
    setReminderHour(0);
    setReminderMinute(0);
  }, []);

  // useEffect(() => {
  //   if (reminderUpdated) updateReminder();
  // }, [reminderUpdated]);

  const updateReminder = async () => {
    try {
      const res = await updateUser({
        user: {},
        ...route.params,
        reminder: true,
        reminderHour,
        reminderMinute,
      });
      console.log(res.data);
      setReminderUpdated(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <ComingSoonModal visible={comingSoon} setVisible={setComingSoon} />
      <ReminderModal
        visible={reminderModal}
        setVisible={setReminderModal}
        reminderHour={reminderHour}
        reminderMinute={reminderMinute}
        setReminderHour={setReminderHour}
        setReminderMinute={setReminderMinute}
        setReminderUpdated={setReminderUpdated}
      />
      <LogoutModal
        visible={logoutModal}
        setVisible={setLogoutModal}
        navigation={navigation}
      />
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <View style={styles.backIcon}>
            <BackIcon />
          </View>
        </TouchableWithoutFeedback>
        <CustomText style={styles.headerText}>{t("settingsScreen:title")}</CustomText>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => navigation.navigate("PersonalInformation")}
        >
          <View style={styles.button}>
            <PersonalInformationIcon />
            <CustomText style={styles.buttonText}>{t("settingsScreen:personal_information")}</CustomText>
            <ArrowLeftIcon color={COLORS.neutral_86} rotate={i18n.language === "en"} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Language", {prev: "Settings"})}
        >
          <View style={styles.button}>
            <LanguageIcon />
            <CustomText style={styles.buttonText}>{t("settingsScreen:change_language")}</CustomText>
            <ArrowLeftIcon color={COLORS.neutral_86} rotate={i18n.language === "en"} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.buttons}>
        {/* <View style={styles.button}>
          <CalendarIcon />
          <CustomText style={styles.buttonText}>یادآور روزانه</CustomText>
          <Switch
            value={reminder}
            onValueChange={(val) => {
              setReminderUpdated(!val);
              setReminder(val);
            }}
            renderInsideCircle={() => (
              <View
                style={{
                  backgroundColor: reminder ? COLORS.tint1 : COLORS.neutral_ad,
                }}
              ></View>
            )}
            circleActiveColor={COLORS.primary}
            circleInActiveColor={COLORS.tint0}
            circleBorderWidth={0}
            circleSize={24}
            renderActiveText={false}
            renderInActiveText={false}
            backgroundActive={COLORS.tint1}
            backgroundInactive={COLORS.neutral_ad}
            containerStyle={
              reminder ? { borderWidth: 1, borderColor: COLORS.primary } : {}
            }
            barHeight={32}
            switchWidthMultiplier={2.4}
          />
        </View>
        <TouchableOpacity
          onPress={() => setReminderModal(true)}
          disabled={!reminder}
        >
          <View style={styles.button}>
            <ClockIcon />
            <CustomText style={[styles.buttonText, { flex: 0 }]}>
              زمان یادآوری
            </CustomText>
            <CustomText style={styles.reminderTime}>
              {e2p(twoDigit(reminderHour))}:{e2p(twoDigit(reminderMinute))}
            </CustomText>
            <ArrowLeftIcon color={COLORS.neutral_86} />
          </View>
        </TouchableOpacity> */}
      </View>
      <View style={styles.buttons}>
        {/* <TouchableOpacity onPress={() => setComingSoon(true)}>
          <View style={[styles.button, styles.buttonBorder]}>
            <FaqIcon />
            <CustomText style={styles.buttonText}>سوالات متداول</CustomText>
            <ArrowLeftIcon color={COLORS.neutral_86} />
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => navigation.navigate("AboutUs")}>
          <View style={[styles.button, styles.buttonBorder]}>
            <AboutUsIcon />
            <CustomText style={styles.buttonText}>{t("settingsScreen:about_us")}</CustomText>
            <ArrowLeftIcon color={COLORS.neutral_86} rotate={i18n.language === "en"} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ContactUs")}>
          <View style={[styles.button, styles.buttonBorder]}>
            <ContactUsIcon />
            <CustomText style={styles.buttonText}>{t("settingsScreen:contact_us")}</CustomText>
            <ArrowLeftIcon color={COLORS.neutral_86} rotate={i18n.language === "en"} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLogoutModal(true)}>
          <View style={styles.button}>
            <LogoutIcon />
            <CustomText style={[styles.buttonText, { color: COLORS.error }]}>
              {t("settingsScreen:logout")}
            </CustomText>
            <ArrowLeftIcon color={COLORS.neutral_86} rotate={i18n.language === "en"} />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

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
  buttons: {
    marginTop: 24,
    backgroundColor: COLORS.backSections,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  buttonText: {
    fontFamily: "estedad_semibold",
    fontSize: 14,
    color: COLORS.neutral_40,
    marginLeft: 8,
    flex: 1,
  },
  buttonBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral_ed,
  },
  reminderTime: {
    fontFamily: "estedad",
    fontSize: 14,
    color: COLORS.neutral_86,
    marginLeft: 16,
    flex: 1,
    textAlign: "left",
  },
});
