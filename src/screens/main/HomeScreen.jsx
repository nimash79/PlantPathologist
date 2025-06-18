import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Constants from "expo-constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import PagerView from "react-native-pager-view";
import { Dimensions } from "react-native";

import config from "../../services/config.json";
import BurgerIcon from "../../components/Icons/BurgersIcon";
import UploadPicIcon from "../../components/Icons/UploadPicIcon";
import CustomText from "../../components/Shared/CustomText";
import { COLORS } from "../../utils/constants";
import {
  e2p,
  miladiFull,
  miladiToArabicFull,
  miladiToPersianFull,
  stringToPhoneNumber,
} from "../../utils/convertors";
import RingbellIcon from "../../components/Icons/RingbellIcon";
import NewIssueIcon from "./../../components/Icons/NewIssueIcon";
import MessageQuestionIcon from "./../../components/Icons/MessageQuestionIcon";
import EmptyWalletIcon from "./../../components/Icons/EmptyWalletIcon";
import VideoSquareIcon from "./../../components/Icons/VideoSquareIcon";
import { useSelector } from "react-redux";
import ComingSoonModal from "../../components/modals/ComingSoonModal";
import { getChats } from "../../services/chatService";
import { getDailyText } from "../../services/settingsService";
import { useTranslation } from "react-i18next";

const HomeScreen = ({ navigation }) => {
  const [conversationsCount, setConversationsCount] = useState(0);
  const [pageReady, setPageReady] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);
  const [page, setPage] = useState(0);
  const [slides, setSlides] = useState([1, 2, 3, 4]);

  const user = useSelector((state) => state.user);

  const { t, i18n } = useTranslation();

  const sliderRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setPageReady(false);
        return;
      }
      let interval;
      (async () => {
        try {
          const slidesRes = await getDailyText();
          console.log(slidesRes.data.data);
          setSlides(slidesRes.data.data);
          // silder timer (comment for now)
          // if (slidesRes.data.data.length)
          //   interval = setInterval(() => {
          //     setPage(p => {
          //       sliderRef.current.setPage(
          //       p === slidesRes.data.data.length - 1 ? 0 : p + 1
          //     );
          //     return p;
          //     })
          //   }, 3000);
          const getChatsRes = await getChats();
          setConversationsCount(getChatsRes.data.data.length);
        } catch (err) {
          console.log(err);
          setConversationsCount(0);
        } finally {
          setPageReady(true);
        }
      })();
      return () => clearInterval(interval);
    }, [])
  );

  if (!pageReady) return null;
  return (
    <View style={styles.container}>
      <ComingSoonModal visible={comingSoon} setVisible={setComingSoon} />
      <View style={styles.body}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("Settings")}
        >
          <View>
            <BurgerIcon style={styles.burgerButton} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setComingSoon(true)}>
          <View>
            <RingbellIcon style={styles.infoButton} />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={user ? { uri: `${config.url}${user.profile_img}` } : null}
              style={styles.profileImage}
            />
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate("PersonalInformation")}
            >
              <View style={styles.uploadPicContainer}>
                <UploadPicIcon style={styles.uploadPic} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ marginLeft: 8 }}>
            <CustomText style={styles.fullname}>
              {i18n.language == "fa" ? user?.fullName : user?.eng_fullName}
            </CustomText>
            <CustomText style={styles.mobile}>
              {stringToPhoneNumber(user ? user.phoneNumber : "")}
            </CustomText>
          </View>
        </View>
        <View style={styles.slider}>
          <PagerView
            style={{ flex: 1 }}
            ref={sliderRef}
            initialPage={page}
            onPageSelected={(e) => setPage(e.nativeEvent.position)}
          >
            {slides.map((slide) => (
              <View style={styles.slide} key={slide.id}>
                <View style={styles.slideColumn1}>
                  <CustomText style={styles.slideTitle}>
                    {i18n.language === "en"
                      ? slide.eng_title
                      : i18n.language === "fa"
                      ? slide.title
                      : slide.ara_title}
                  </CustomText>
                  <CustomText style={styles.slideText}>
                    {i18n.language === "en"
                      ? slide.eng_content
                      : i18n.language === "fa"
                      ? slide.content
                      : slide.ara_content}
                  </CustomText>
                </View>
                <View style={styles.slideColumn2}>
                  <CustomText style={styles.slideTime}>
                    {i18n.language === "en"
                      ? miladiFull(slide.date_created)
                      : i18n.language === "fa"
                      ? miladiToPersianFull(slide.date_created)
                      : miladiToArabicFull(slide.date_created)}
                  </CustomText>
                  <Image
                    source={
                      slide.content_img
                        ? { uri: `${config.url}${slide.content_img}` }
                        : null
                    }
                    style={styles.slideImage}
                  />
                </View>
              </View>
            ))}
          </PagerView>
          <View style={styles.slideButtons}>
            {[...Array.from({ length: slides.length })].map((item, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => sliderRef.current.setPage(index)}
              >
                <View
                  style={
                    index === page
                      ? [styles.slideButton, styles.slideButtonActive]
                      : styles.slideButton
                  }
                ></View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </View>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("SelectSpecialist")}
        >
          <View style={styles.issueContainer}>
            <NewIssueIcon style={styles.issueIcon} />
            <CustomText style={styles.issueTitle}>
              {t("homeScreen:new_issue")}
            </CustomText>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.infos}>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("Conversations")}
          >
            <View style={styles.infoContainer}>
              <View style={styles.infoHeader}>
                <MessageQuestionIcon />
                <CustomText style={styles.infoHeaderText}>
                  {t("homeScreen:issues_count")}
                </CustomText>
              </View>
              <CustomText style={styles.infoValue}>
                {e2p(conversationsCount, i18n.language == "en")}
              </CustomText>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => setComingSoon(true)}>
            <View style={[styles.infoContainer, { marginLeft: 16 }]}>
              <View style={styles.infoHeader}>
                <EmptyWalletIcon />
                <CustomText style={styles.infoHeaderText}>
                  {t("homeScreen:increase_balance")}
                </CustomText>
              </View>
              <CustomText style={styles.infoValue}>
                {e2p(user?.Expenses.toLocaleString(), i18n.language == "en")}
              </CustomText>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <TouchableWithoutFeedback onPress={() => setComingSoon(true)}>
          <View style={styles.trialContainer}>
            <VideoSquareIcon />
            <CustomText style={styles.trialText}>
              {t("homeScreen:usage_guide")}
            </CustomText>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.footer}>
        <Image
          source={require("../../../assets/inapp/logo.png")}
          style={styles.footerImage}
        />
        <CustomText style={styles.footerText}>
          {t("homeScreen:copyright")} {"\n"}® Jahorm University
        </CustomText>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF7FF",
    paddingHorizontal: "5%",
    marginTop: Constants.statusBarHeight,
    paddingTop: 8,
  },
  body: {
    flex: 1,
  },
  burgerButton: {
    position: "absolute",
    top: 4,
    right: 0,
  },
  infoButton: {
    position: "absolute",
    top: 4,
    left: 0,
  },
  profileContainer: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
  },
  profileImageContainer: {
    width: 64,
    height: 64,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: COLORS.primary_900,
  },
  uploadPicContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.neutral_f9,
    borderColor: COLORS.primary_900,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullname: {
    fontFamily: "estedad_semibold",
    fontSize: 14,
    color: COLORS.neutral_40,
  },
  mobile: {
    fontFamily: "estedad",
    fontSize: 10,
    color: COLORS.neutral_ad,
    marginTop: 6,
  },
  issueContainer: {
    marginTop: 24,
    backgroundColor: "#B7D8CA",
    borderRadius: 8,
    alignItems: "center",
  },
  issueIcon: {
    marginTop: 16,
  },
  issueTitle: {
    fontFamily: "estedad_bold",
    fontSize: 14,
    marginTop: 12,
    marginBottom: 26,
  },
  infos: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoContainer: {
    backgroundColor: COLORS.tint1,
    marginTop: 16,
    borderRadius: 8,
    flex: 0.5,
  },
  infoHeader: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  infoHeaderText: {
    fontFamily: "estedad_semibold",
    fontSize: 12,
    color: COLORS.primary_900,
    marginLeft: 8,
  },
  infoValue: {
    fontFamily: "estedad_bold",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 8,
  },
  trialContainer: {
    marginTop: 16,
    backgroundColor: "#C7EBDC",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 27.5,
  },
  trialText: {
    fontFamily: "estedad_semibold",
    fontSize: 12,
    color: COLORS.primary_900,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  footerImage: {
    width: 72,
    height: 72,
  },
  footerText: {
    fontFamily: "estedad_semibold",
    fontSize: 10,
    color: COLORS.primary,
    marginLeft: 8,
    flex: 1,
    textAlign: "center",
  },
  slider: {
    height: 105,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#4DE9A8",
    borderRadius: 8,
    padding: 8,
  },
  slide: {
    flexDirection: "row",
  },
  slideColumn1: {
    width: "75%",
  },
  slideColumn2: {
    width: "25%",
    alignItems: "flex-end",
  },
  slideTitle: {
    fontFamily: "estedad",
    fontSize: 12,
    color: COLORS.shade2,
    marginLeft: 8,
  },
  slideText: {
    fontFamily: "estedad_regular",
    fontSize: 10,
    color: COLORS.neutral_60,
  },
  slideTime: {
    fontFamily: "estedad_regular",
    fontSize: 8,
    color: COLORS.neutral_60,
    textAlign: "right",
    marginBottom: 5,
  },
  slideImage: {
    width: 50,
    height: 50,
  },
  slideButtons: {
    flexDirection: "row",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  slideButton: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.tint2,
    marginLeft: 4,
  },
  slideButtonActive: {
    backgroundColor: COLORS.primary_800,
  },
});
