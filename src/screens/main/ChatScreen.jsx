import {
  Image,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  ScrollView,
} from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";

import { COLORS } from "../../utils/constants";
import BackIcon from "../../components/Icons/BackIcon";
import CustomText from "../../components/Shared/CustomText";
import LittleStepsFilledIcon from "../../components/Icons/ProfileIcons/LittleStepsFilledIcon";
import VoiceIcon from "../../components/Icons/ProfileIcons/VoiceIcon";
import AttachFileIcon from "./../../components/Icons/AttachIcon";
import AttachmentsModal from "../../components/modals/AttachmentsModal";
import SendIcon from "./../../components/Icons/SendIcon";
import ChatDisableIcon from "./../../components/Icons/ChatDisableIcon";
import ArrowRight from "./../../components/Icons/ArrowRight";
import ChatMessage from "../../components/chat/ChatMessage";
import { useSelector } from "react-redux";
import { createChatRoom, getChat } from "../../services/chatService";
import { e2p, generateVoiceDuration, twoDigit } from "../../utils/convertors";
import { useTranslation } from "react-i18next";

const ChatScreen = ({ navigation, route }) => {
  const [pageIsReady, setPageIsReady] = useState(false);
  const [initial, setIntitial] = useState(false);
  const [specialist, setSpecialist] = useState();
  const [specialityName, setSpecialityName] = useState();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [attachmentsModal, setAttachmentsModal] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [image, setImage] = useState();
  const [document, setDocument] = useState();
  const [voice, setVoice] = useState();
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [voiceInterval, setVoiceInterval] = useState();
  const [socket, setSocket] = useState();
  const [progress, setProgress] = useState(0);

  const user = useSelector((state) => state.user);

  const scrollViewRef = useRef(null);

  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const {t, i18n} = useTranslation();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
      if (socket) socket.close();
    };
  }, []);

  useEffect(() => {
    setSpecialist(route.params.specialist);
    setSpecialityName(route.params.specialityName);
    if (!specialist) return;
    (async () => {
      if (route.params.roomId) {
        handleSocket(route.params.roomId, user.phoneNumber);
      } else {
        setIntitial(true);
      }
    })();
    setPageIsReady(true);
  }, [route.params, specialist]);

  const handleSocket = (roomId, username) => {
    const chatSocket = new WebSocket(
      `ws://151.232.36.49:8000/ws/chat/${roomId}/${username}/`
    );
    setSocket(chatSocket);

    chatSocket.onopen = async () => {
      let { data } = await getChat(route.params.roomId);
      if (!data.length) return;
      data.forEach((msg) => {
        setMessages((ms) => [
          ...ms,
          {
            id: msg.id,
            text: msg.message,
            me: user.phoneNumber === msg.sender.phoneNumber,
            time:
              twoDigit(new Date(msg.timestamp).getHours()) +
              ":" +
              twoDigit(new Date(msg.timestamp).getMinutes()),
            sender:
              user.phoneNumber === msg.sender.phoneNumber
                ? user
                : specialist,
            speciality: specialityName,
            seen: msg.seen,
            sent: true,
            isFile:
              msg.msg_type === "file" ||
              msg.msg_type === "voice" ||
              msg.msg_type === "image" ||
              msg.msg_type === "pdf" ||
              msg.msg_type === "audio" ||
              msg.msg_type === "video",
            isVoice: msg.msg_type === "voice",
            isPayment: msg.msg_type === "payment",
            msg_type: msg.msg_type,
            uploading: false,
            afterUpload,
          },
        ]);
        // seen message
        // if (!msg.seen && msg.sender.phoneNumber !== user.phoneNumber) {
        //   chatSocket.send(
        //     JSON.stringify({
        //       id: msg.id,
        //       action: "seen",
        //     })
        //   );
        // }
      });
    };

    chatSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("socket onmessage:", data);

      if (data.action === "seen") {
        setMessages((ms) => {
          const messagesCopy = [...ms];
          const messageIndex = messagesCopy.findIndex((x) => x.id == data.id);
          messagesCopy[messageIndex].seen = true;
          return messagesCopy;
        });
      } else {
        // if (!data.date_time.includes("+")) data.date_time += "+00:00";
        const dateTime = new Date(data.timestamp);
        // if (data.phoneNumber !== user.phoneNumber && !data.seen) {
        //   setSocket((s) => {
        //     s.send(
        //       JSON.stringify({
        //         id: data.id,
        //         action: "seen",
        //       })
        //     );
        //     return s;
        //   });
        // }
        setMessages((ms) => [
          ...ms,
          {
            id: data.id,
            text: data.message,
            me: user.phoneNumber === data.phoneNumber,
            time:
              twoDigit(new Date(dateTime).getHours()) +
              ":" +
              twoDigit(new Date(dateTime).getMinutes()),
            sender:
              user.phoneNumber === data.phoneNumber
                ? user
                : specialist,
            speciality: specialityName,
            seen: data.seen,
            sent: true,
            isFile:
              data.msg_type === "file" ||
              data.msg_type === "voice" ||
              data.msg_type === "image" ||
              data.msg_type === "video" ||
              data.msg_type === "audio" ||
              data.msg_type === "pdf",
            isVoice: data.msg_type === "voice",
            isPayment: data.msg_type === "payment",
            msg_type: data.msg_type,
            uploading: false,
            afterUpload,
          },
        ]);
      }
    };
    chatSocket.onerror = function (e) {
      console.error("Chat socket error:", e);
    };
    chatSocket.onclose = function (e) {
      console.error("Chat socket closed unexpectedly:", e);
    };
  };

  const sendMessage = async (msg, type) => {
    if (!socket) {
      try {
        const phoneNumbers = [user.phoneNumber, specialist.phoneNumber];
        const { data } = await createChatRoom(phoneNumbers);
        handleSocket(data.data.room_id, user.phoneNumber);
        setIntitial(false);
      } catch (err) {
        console.log("create chatroom error:", err);
      }
    }
    setTimeout(() => {
      setSocket((s) => {
        s.send(
          type === "text"
            ? JSON.stringify({
                message: msg,
                phoneNumber: user.phoneNumber,
                msg_type: type,
                action: "text",
              })
            : JSON.stringify({
                ...msg,
                phoneNumber: user.phoneNumber,
                msg_type: type,
                action: "file",
              })
        );
        return s;
      });
    }, 500);
    setMessage("");
  };

  useEffect(() => {
    if (image) {
      setMessages((ms) => [
        ...ms,
        {
          id: 0,
          text: image,
          me: true,
          time:
            twoDigit(new Date().getHours()) +
            ":" +
            twoDigit(new Date().getMinutes()),
          sender: user,
          speciality: specialityName,
          seen: false,
          sent: false,
          isFile: true,
          isVoice: false,
          msg_type: "image",
          uploading: true,
        },
      ]);
    }
    setIntitial(false);
  }, [image]);

  useEffect(() => {
    if (document) {
      setMessages((ms) => [
        ...ms,
        {
          id: 0,
          text: {
            uri: document.uri,
            fileName: document.name,
            mimeType: document.mimeType,
            fileSize: document.size,
          },
          me: true,
          time:
            twoDigit(new Date().getHours()) +
            ":" +
            twoDigit(new Date().getMinutes()),
          sender: user,
          speciality: specialityName,
          seen: false,
          sent: false,
          isFile: true,
          isVoice: false,
          msg_type: "pdf",
          uploading: true,
        },
      ]);
    }
    setIntitial(false);
  }, [document]);

  useEffect(() => {
    if (voice) {
      setMessages((ms) => [
        ...ms,
        {
          id: 0,
          text: {
            uri: voice.uri,
            fileName: voice.name,
            mimeType: voice.mimeType,
            duration: voice.duration,
          },
          me: true,
          time:
            twoDigit(new Date().getHours()) +
            ":" +
            twoDigit(new Date().getMinutes()),
          sender: user,
          speciality: specialityName,
          seen: false,
          sent: false,
          isFile: true,
          isVoice: true,
          msg_type: "voice",
          uploading: true,
        },
      ]);
    }
    setIntitial(false);
  }, [voice]);

  const afterUpload = (msg) => {
    setImage(null);
    setDocument(null);
    setVoice(null);
    sendMessage(msg, msg.file_type);
  };

  const startRecording = async () => {
    try {
      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const interval = setInterval(() => {
        setVoiceDuration((x) => x + 1);
      }, 1000);
      setVoiceInterval(interval);
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      const recordingStatus = await recording.getStatusAsync();
      console.log("recording object:", recording._options);
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    clearInterval(voiceInterval);
    setVoiceInterval(null);
    const uri = recording.getURI();
    setVoice({
      name: uri.split("/").at(-1),
      mimeType: "audio/m4a",
      duration: voiceDuration,
      uri,
    });
    console.log("Recording stopped and stored at", uri);
    setVoiceDuration(0);
  };

  if (!pageIsReady) return null;

  return (
    <LinearGradient
      colors={["#DDFFF5", "#F4FFFA", "#DDFFF8", "#EEFFFF"]}
      style={styles.gradient}
    >
      <AttachmentsModal
        visible={attachmentsModal}
        setVisible={setAttachmentsModal}
        setImage={setImage}
        setDocument={setDocument}
      />
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
        {initial ? (
          <View style={styles.initialGuide}>
            <CustomText style={styles.guide}>
              {t("chatScreen:guide1")}
            </CustomText>
            <CustomText style={styles.guide}>{t("chatScreen:guide2")}</CustomText>
            <Image
              source={require("../../../assets/inapp/chat.png")}
              style={styles.chatImage}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={{ flex: keyboardVisible ? 0.78 : 0.86 }}>
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.messages}
              onContentSizeChange={() => {
                setTimeout(() => {
                  scrollViewRef.current.scrollToEnd({ animated: true });
                }, 100);
              }}
            >
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  navigation={navigation}
                  text={msg.text}
                  me={msg.me}
                  time={msg.time}
                  sender={msg.sender}
                  speciality={msg.speciality}
                  seen={msg.seen}
                  sent={msg.sent}
                  isFile={msg.isFile}
                  isVoice={msg.isVoice}
                  isPayment={msg.isPayment}
                  msg_type={msg.msg_type}
                  uploading={msg.uploading}
                  afterUpload={afterUpload}
                />
              ))}
            </ScrollView>
          </View>
        )}
        {disabled ? (
          <View style={styles.chatDisable}>
            <ChatDisableIcon />
            <CustomText style={styles.chatDisableText}>
              {t("chatScreen:disabled")}
            </CustomText>
          </View>
        ) : (
          <View style={styles.footer}>
            {recording ? (
              <View style={styles.inputContainer}>
                <View style={styles.voiceStatus}>
                  <View style={styles.voiceAlert}></View>
                  <TextInput style={styles.voiceDuration}>
                    {generateVoiceDuration(voiceDuration)}
                  </TextInput>
                </View>
                <View style={styles.cancelRecording}>
                  <ArrowRight />
                  <TextInput style={styles.cancelRecordingText}>
                    {t("chatScreen:voice_cancel")}
                  </TextInput>
                </View>
                <TouchableWithoutFeedback onPressOut={stopRecording}>
                  <View style={styles.voiceContainer}>
                    <VoiceIcon />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            ) : (
              <View
                style={[
                  styles.inputContainer,
                  keyboardVisible ? { backgroundColor: COLORS.primary_0 } : {},
                ]}
              >
                <TouchableWithoutFeedback
                  onPress={() => setAttachmentsModal(true)}
                >
                  <AttachFileIcon />
                </TouchableWithoutFeedback>
                <TextInput
                  style={styles.input}
                  placeholder={t("chatScreen:input_placeholder")}
                  placeholderTextColor={COLORS.neutral_ad}
                  onChangeText={setMessage}
                  value={message}
                />
                {message.length ? (
                  <TouchableWithoutFeedback
                    onPress={() => sendMessage(message, "text")}
                  >
                    <SendIcon />
                  </TouchableWithoutFeedback>
                ) : (
                  <TouchableWithoutFeedback onPressIn={startRecording}>
                    <View
                      style={[
                        styles.voiceContainer,
                        { backgroundColor: "transparent" },
                      ]}
                    >
                      <VoiceIcon />
                    </View>
                  </TouchableWithoutFeedback>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  header: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "5%",
    marginBottom: 24,
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
  initialGuide: {
    width: "100%",
    alignItems: "center",
    textAlign: "center",
    marginTop: 140,
  },
  guide: {
    fontFamily: "estedad",
    fontSize: 14,
    color: COLORS.primary,
    textAlign: "center",
  },
  chatImage: {
    width: "50%",
  },
  footer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 16,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.primary_500,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 48,
  },
  input: {
    fontFamily: "estedad",
    fontSize: 14,
    marginHorizontal: 8,
    flex: 1,
    height: "100%",
  },
  chatDisable: {
    backgroundColor: COLORS.tint3,
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    height: 72,
    paddingLeft: 26,
  },
  chatDisableText: {
    fontFamily: "estedad",
    fontSize: 12,
    color: COLORS.neutral_40,
    marginLeft: 8,
  },
  messages: {
    justifyContent: "flex-end",
    paddingHorizontal: "5%",
    paddingVertical: 4,
  },
  voiceStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  voiceDuration: {
    fontFamily: "estedad",
    fontSize: 13,
    color: COLORS.primary,
  },
  voiceAlert: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error_light1,
    marginRight: 8,
  },
  cancelRecording: {
    flexDirection: "row",
    alignItems: "center",
    flex: 0.8,
    justifyContent: "flex-end",
  },
  cancelRecordingText: {
    fontFamily: "estedad_semibold",
    fontSize: 10,
    color: COLORS.neutral_86,
    marginLeft: 8,
  },
  voiceContainer: {
    backgroundColor: COLORS.tint1,
    height: "100%",
    aspectRatio: 1 / 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
  },
});
