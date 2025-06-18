import {
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";

import LittleStepsFilledIcon from "../../components/Icons/ProfileIcons/LittleStepsFilledIcon";
import CustomText from "../../components/Shared/CustomText";
import { COLORS } from "../../utils/constants";
import BackIcon from "../../components/Icons/BackIcon";
import CustomButton from "../../components/Shared/CustomButton";
import { getAllSpecialists } from "../../services/specialistService";
import config from "../../services/config.json";
import ErrorAlert from "./../../components/alerts/ErrorAlert";
import { useTranslation } from "react-i18next";

const SelectSpecialistScreen = ({ navigation }) => {
  const [pageIsReady, setPageIsReady] = useState(false);
  const [specialists, setSpecialists] = useState([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState();
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState();

  const {t, i18n} = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAllSpecialists();
        console.log(data);
        setSpecialists(data.data);
        setPageIsReady(true);
      } catch (err) {
        console.log(err);
      }
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

  const submit = () => {
    if (!selectedSpecialist) {
      setErrorText(t("selectSpecialistScreen:validation"));
      setError(true);
      return;
    }
    navigation.navigate("Chat", {
      specialist: specialists.find((s) => s.user === selectedSpecialist),
      specialityName: i18n.language === "en" ? specialists.find((s) => s.user === selectedSpecialist).speciality_eng_name
      : i18n.language === "fa" ? specialists.find((s) => s.user === selectedSpecialist).specialty_name
      : specialists.find((s) => s.user === selectedSpecialist).speciality_ara_name,
    });
  };

  if (!pageIsReady) return false;
  return (
    <LinearGradient
      colors={["#DDFFF5", "#F4FFFA", "#DDFFF8", "#EEFFFF"]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <View style={styles.backIcon}>
              <BackIcon />
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.headerTextContainer}>
            <CustomText style={styles.headerText}>{t("common:app_name")}</CustomText>
            <View style={styles.headerTextBorder}></View>
          </View>
          <LittleStepsFilledIcon
            color={COLORS.primary}
            style={{ opacity: 0 }}
          />
        </View>
        <ErrorAlert
          visible={error}
          setVisible={setError}
          text={errorText}
          style={{ width: "90%", alignSelf: "center" }}
        />
        <View style={{ alignSelf: "center" }}>
          <CustomText style={styles.title}>
            {t("selectSpecialistScreen:title")}
          </CustomText>
          <ScrollView style={styles.specialists}>
            {specialists.map((specialist) => (
              <TouchableWithoutFeedback
                key={specialist.user}
                onPress={() => setSelectedSpecialist(specialist.user)}
              >
                <View
                  style={
                    specialist.user === selectedSpecialist
                      ? [styles.specialist, styles.selectedSpecialist]
                      : styles.specialist
                  }
                >
                  <View style={styles.specialistProfileContainer}>
                    <Image
                      source={
                        specialist.profile_img
                          ? { uri: `${config.url}${specialist.profile_img}` }
                          : require("../../../assets/inapp/profile.png")
                      }
                      style={styles.specialistProfile}
                    />
                  </View>
                  <View style={styles.specialistInfoContainer}>
                    <CustomText style={styles.specialistName}>
                      {i18n.language == "en" ? specialist.eng_fullName
                      : i18n.language == "fa" ? specialist.fullName
                      : specialist.ara_fullName}
                    </CustomText>
                    <CustomText style={styles.specialistField}>
                      {i18n.language == "en" ? specialist.specialty_eng_name
                      : i18n.language == "fa" ? specialist.specialty_name
                      : specialist.specialty_ara_name}
                    </CustomText>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>
        </View>
        <CustomButton text={t("selectSpecialistScreen:confirm")} onClick={submit} />
      </View>
    </LinearGradient>
  );
};

export default SelectSpecialistScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: "5%",
    marginTop: Constants.statusBarHeight + 8,
  },
  header: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "5%",
  },
  headerText: {
    fontFamily: "estedad_bold",
    fontSize: 20,
    color: COLORS.neutral_40,
  },
  headerTextBorder: {
    position: "absolute",
    bottom: -16,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.primary_100,
  },
  title: {
    fontFamily: "estedad_semibold",
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 62,
  },
  specialists: {
    marginTop: 48,
    maxHeight: 355,
  },
  specialist: {
    flexDirection: "row",
    marginBottom: 24,
    alignItems: "center",
    height: 47,
    padding: 8,
    borderRadius: 16,
  },
  specialistProfileContainer: {
    width: 40,
    height: 40,
  },
  specialistProfile: {
    borderColor: COLORS.neutral_df,
    borderWidth: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  specialistInfoContainer: {
    marginLeft: 16,
  },
  specialistName: {
    fontFamily: "estedad_bold",
    fontSize: 14,
    color: COLORS.neutral_20,
  },
  specialistField: {
    fontFamily: "estedad_regular",
    fontSize: 10,
    color: COLORS.neutral_40,
    maxWidth: 200
  },
  selectedSpecialist: {
    backgroundColor: COLORS.tint2,
  },
});
