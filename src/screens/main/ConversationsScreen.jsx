import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Constants from "expo-constants";

import { COLORS } from "../../utils/constants";
import BackIcon from "../../components/Icons/BackIcon";
import CustomText from "../../components/Shared/CustomText";
import { useCallback, useState } from "react";
import { getChats } from "../../services/chatService";
import { useSelector } from "react-redux";
import { miladi2, miladiToArabic2, miladiToPersian2 } from "../../utils/convertors";
import { useFocusEffect } from "@react-navigation/native";
import FileIcon from "../../components/chat/FileIcon";
import VoiceIcon from "../../components/Icons/ProfileIcons/VoiceIcon";
import { useTranslation } from "react-i18next";

const ConversationsScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [pageIsReady, setPageIsReady] = useState(false);
  const [users, setUsers] = useState([]);
  const user = useSelector((state) => state.user);

  const { t, i18n } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          let { data } = await getChats(user.phoneNumber);
          data = data.data.filter((d) => d.last_message !== null);
          console.log(data[0]);
          // data = data.sort(
          //   (a, b) =>
          //     new Date(b.messages[0].date_time) -
          //     new Date(a.messages[0].date_time)
          // );
          // console.log(data[0].messages);
          setConversations(data);
          setPageIsReady(true);
        } catch (err) {
          console.log(err);
        }
      })();
    }, [])
  );

  if (!pageIsReady) return null;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <View style={styles.backIcon}>
            <BackIcon />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.headerTextContainer}>
          <CustomText style={styles.headerText}>
            {t("conversationsScreen:issues")}
          </CustomText>
        </View>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("SelectSpecialist")}
        >
          <View>
            <CustomText style={styles.newConversation}>
              {t("conversationsScreen:new")}
            </CustomText>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <ScrollView style={styles.conversations}>
        {conversations.map((conversation) => (
          <TouchableWithoutFeedback
            key={conversation.id}
            onPress={() =>
              navigation.navigate("Chat", {
                roomId: conversation.id,
                specialist: conversation.users.find(
                  (x) => x.phoneNumber !== user.phoneNumber
                ),
                specialityName: conversation.users.find(
                  (x) => x.phoneNumber !== user.phoneNumber
                ).specialties_name,
              })
            }
          >
            <View style={styles.conversation}>
              <View style={styles.conversationImage}>
                <Image
                  source={
                    conversation.users.find(
                      (x) => x.phoneNumber !== user.phoneNumber
                    ).profile_img
                      ? {
                          uri: `${
                            conversation.users.find(
                              (x) => x.phoneNumber !== user.phoneNumber
                            ).profile_img
                          }`,
                        }
                      : require("../../../assets/inapp/profile.png")
                  }
                  style={styles.conversationImage}
                />
              </View>
              <View style={styles.conversationText}>
                <CustomText style={styles.conversationContact}>
                  {
                    i18n.language === "en" ? conversation.users.find(
                      (x) => x.phoneNumber !== user.phoneNumber
                    ).eng_fullName
                    : i18n.language === "fa" ? conversation.users.find(
                      (x) => x.phoneNumber !== user.phoneNumber
                    ).fullName
                    : conversation.users.find(
                      (x) => x.phoneNumber !== user.phoneNumber
                    ).ara_fullName
                  }{" "}
                  {conversation.referrer_name && (
                    <CustomText style={styles.referrer}>
                      ({conversation.referrer_name})
                    </CustomText>
                  )}
                </CustomText>
                <View style={styles.lastMessage}>
                  {conversation.last_message.msg_type == "file" ||
                  conversation.last_message.msg_type == "image" ||
                  conversation.last_message.msg_type == "pdf" ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <CustomText
                        style={[
                          styles.conversationLastMessage,
                          { marginRight: 8 },
                        ]}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                      >
                        {
                          JSON.parse(conversation.last_message.message)
                            .file_name
                        }
                      </CustomText>
                      <FileIcon />
                    </View>
                  ) : conversation.last_message.msg_type == "payment" ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <CustomText
                        style={[
                          styles.conversationLastMessage,
                          { marginRight: 8 },
                        ]}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                      >
                        {t("conversationsScreen:payment_notification")}{" "}
                        {JSON.parse(conversation.last_message.message).amount}{" "}
                        ریال
                      </CustomText>
                    </View>
                  ) : conversation.last_message.msg_type == "voice" ||
                    conversation.last_message.msg_type == "audio" ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <CustomText
                        style={[
                          styles.conversationLastMessage,
                          { marginRight: 8 },
                        ]}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                      >
                        {t("conversationsScreen:voice_message")}
                      </CustomText>
                      <VoiceIcon />
                    </View>
                  ) : (
                    <CustomText style={styles.conversationLastMessage}>
                      {conversation.last_message.message}
                    </CustomText>
                  )}
                </View>
              </View>
              <View style={styles.conversationInfo}>
                {conversation.last_message.sender.phoneNumber !==
                  user.phoneNumber &&
                  !conversation.last_message.seen && (
                    <View style={styles.conversationAlert}></View>
                  )}
                <CustomText style={styles.conversationTime}>
                  {i18n.language === "en"
                    ? miladi2(
                        new Date(conversation.last_message.timestamp)
                      )
                    : i18n.language === "fa"
                    ? miladiToPersian2(
                        new Date(conversation.last_message.timestamp)
                      )
                    : miladiToArabic2(
                        new Date(conversation.last_message.timestamp)
                      )}
                </CustomText>
              </View>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </View>
  );
};

export default ConversationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF7FF",
    marginTop: Constants.statusBarHeight,
    paddingTop: 8,
  },
  header: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "5%",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral_ad,
  },
  headerText: {
    fontFamily: "estedad_semibold",
    fontSize: 14,
    color: COLORS.neutral_20,
  },
  newConversation: {
    fontFamily: "estedad_semibold",
    fontSize: 10,
    color: COLORS.primary,
  },
  conversation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: "5%",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral_df,
  },
  conversationImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  conversationText: {
    flex: 1,
    marginLeft: 16,
  },
  conversationContact: {
    fontFamily: "estedad_semibold",
    fontSize: 14,
    color: COLORS.neutral_20,
  },
  conversationLastMessage: {
    fontFamily: "estedad",
    fontSize: 10,
    maxWidth: 150,
  },
  conversationInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  conversationTime: {
    fontFamily: "estedad",
    fontSize: 10,
    // flex: 0.7,
  },
  conversationAlert: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.error,
    marginRight: 8,
  },
  referrer: {
    fontSize: 11,
    color: COLORS.neutral_60,
  },
});
