import {
  Linking,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import CircularProgress from "react-native-circular-progress-indicator";
import { Directory, File, Paths } from "expo-file-system/next";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import {
  PlayerState,
  Waveform,
} from "@simform_solutions/react-native-audio-waveform";

import config from "../../services/config.json";
import CustomText from "../Shared/CustomText";
import { COLORS } from "../../utils/constants";
import SenderTail from "./SenderTail";
import ReceiverTail from "./ReceiverTail";
import SentIcon from "./SentIcon";
import SeenIcon from "./SeenIcon";
import NotSentIcon from "./NotSentIcon";
import FileIcon from "./FileIcon";
import DownloadIcon from "./DownloadIcon";
import UploadIcon from "./UploadIcon";
import CancelIcon from "./CancelIcon";
import { uploadFileToChat } from "../../services/chatService";
import PauseIcon from "./PauseIcon";
import PlayIcon from "./PlayIcon";
import CustomButton from "./../Shared/CustomButton";
import {
  convertUriToPath,
  generateFileSize,
  generateVoiceDurationMilli,
} from "../../utils/convertors";
import { useTranslation } from "react-i18next";

const ChatMessage = ({
  navigation,
  text,
  me,
  time,
  sender,
  speciality,
  seen,
  sent,
  isFile,
  isVoice,
  isPayment,
  msg_type,
  uploading = false,
  afterUpload,
}) => {
  const [hidden, setHidden] = useState(false);
  const [message, setMessage] = useState("");
  const [extension, setExtension] = useState("");
  const [startProgress, setStartProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileSize, setFileSize] = useState(0);
  const [downloaded, setDownloaded] = useState(false);
  const [voiceState, setVoiceState] = useState(PlayerState.stopped);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [voicePath, setVoicePath] = useState("");
  const [fileUrl, setFileUrl] = useState();
  const [paymentLink, setPaymentLink] = useState();
  const [paymentAmount, setPaymentAmount] = useState();
  const [paymentMessage, setPaymentMessage] = useState();

  const { t, i18n } = useTranslation();

  const voiceRef = useRef(null);
  const cancellationTokenRef = useRef(null);

  useEffect(() => {
    if (isFile) {
      let jsonMessage;
      if (!uploading) {
        if (typeof text == "string") jsonMessage = JSON.parse(text);
        else jsonMessage = text;
      }
      const fileName = uploading ? text.fileName : jsonMessage.file_name;
      const list = fileName.split(".");
      setExtension(list.at(-1));
      delete list[list.length - 1];
      setMessage(list.join(""));
      setFileSize(
        uploading && text.fileSize
          ? generateFileSize(text.fileSize)
          : jsonMessage
          ? jsonMessage.file_size
          : 0
      );
      if (jsonMessage) setFileUrl(jsonMessage.file_url);
      // for received files
      const fileUri = `${
        Paths.document.uri
      }/plant_pathologist/${fileName.replaceAll(" ", "_")}`;
      const file = new File(fileUri);
      setDownloaded(file.exists);
      // change later
      setDownloaded(true);
      // ---------------
      if (file.exists) setFileSize(generateFileSize(file.size));
      if (isVoice) setVoicePath(convertUriToPath(fileUri));
    } else setMessage(text);
  }, [isFile]);

  useEffect(() => {
    if (isPayment) {
      const jsonMessage = JSON.parse(text);
      setPaymentLink(jsonMessage.payment_link);
      setPaymentAmount(jsonMessage.amount);
      setPaymentMessage(jsonMessage.customMessage);
    }
  }, [isPayment]);

  useEffect(() => {
    if (uploading) uploadFile();
  }, [uploading]);

  // const downloadCallback = (downloadProgress) => {
  //   setProgress(
  //     (downloadProgress.totalBytesWritten /
  //       downloadProgress.totalBytesExpectedToWrite) *
  //     100
  //   );
  //   setFileSize((downloadProgress.totalBytesExpectedToWrite / 1e6).toFixed(2));
  // };

  const downloadFile = async () => {
    try {
      setStartProgress(true);
      const destination = new Directory(Paths.document, "plant_pathologist");
      if (!destination.exists) destination.create();
      const url = `${config.url}${fileUrl.replaceAll(" ", "_")}`;
      const output = await File.downloadFileAsync(url, destination);
      console.log("File downloaded to ", output.uri);
      setDownloaded(true);
    } catch (error) {
      console.error(error);
    } finally {
      setStartProgress(false);
    }
  };

  const uploadFile = async () => {
    console.log("file uploading");
    setStartProgress(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: text.uri,
        name: text.fileName,
        type: text.mimeType,
      });
      const res = await uploadFileToChat(formData, setProgress);
      console.log(res.status, res.data);
      if (res.status === 201) {
        afterUpload(res.data);
        // save file to local storage
        const file = new File(text.uri);
        const destinationFile = new File(
          Paths.document,
          "plant_pathologist",
          res.data.file_name.replaceAll(" ", "_")
        );
        if (!file.exists) file.move(destinationFile);
        console.log("file moved!", res.data.file_name.replaceAll(" ", "_"));
        setHidden(true);
        sent = true;
      }
    } catch (err) {
      console.log(err);
    } finally {
      console.log("here");
      setStartProgress(false);
    }
  };

  const getMimeType = (extension) => {
    switch (extension.toLowerCase()) {
      case "pdf":
        return "application/pdf";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "mp4":
        return "video/mp4";
      case "mov":
        return "video/quicktime";
      case "mp3":
        return "audio/mpeg";
      default:
        return "*/*"; // fallback if unknown
    }
  };

  const openFile = async () => {
    // if (downloaded || sent) {
    //   const fileUri = `${Paths.document.uri}/plant_pathologist/${message}.${extension}`;
    //   if (["png", "jpg", "jpeg"].includes(extension))
    //     navigation.navigate("ViewFile", { uri: fileUri, extension });
    //   else await Linking.openURL(`${config.url}${fileUrl}`);
    // }
    await Linking.openURL(`${config.url}${fileUrl}`);
  };

  const handleVoice = async () => {
    if (!downloaded) downloadFile(message, extension);
    else if (voiceState == "playing") await voiceRef.current.pausePlayer();
    else if (voiceState == "paused") await voiceRef.current.resumePlayer();
    else await voiceRef.current.startPlayer();
  };

  if (hidden) return null;

  if (me)
    return (
      <View style={styles.senderContainer}>
        <SenderTail style={styles.senderTail} />
        {isVoice ? (
          <View style={styles.voiceContainer}>
            {voicePath && (
              <Waveform
                containerStyle={styles.waveform}
                mode="static"
                ref={voiceRef}
                // path={require("../../../assets/recording-test.m4a")}
                path={voicePath}
                candleSpace={2}
                candleWidth={2}
                scrubColor={COLORS.primary}
                waveColor={COLORS.neutral_ad}
                onError={(err) => console.log("ERRR:", err)}
                onPlayerStateChange={(playerState) => {
                  setVoiceState(playerState);
                }}
                onCurrentProgressChange={(_currentProgress, _songDuration) => {
                  setCurrentDuration(_currentProgress);
                  setVoiceDuration(_songDuration);
                }}
              />
            )}
            <TouchableWithoutFeedback onPress={handleVoice}>
              <View>
                {!downloaded && !startProgress ? (
                  <DownloadIcon />
                ) : !downloaded && startProgress ? (
                  <CancelIcon />
                ) : voiceState == "playing" ? (
                  <PauseIcon />
                ) : (
                  <PlayIcon />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        ) : isFile ? (
          <TouchableWithoutFeedback onPress={openFile}>
            <View style={styles.fileContainer}>
              <View style={styles.fileContainerBackground}></View>
              <CustomText style={styles.fileName}>{message}</CustomText>
              {sent ? (
                <FileIcon style={styles.fileIcon} />
              ) : (
                <View style={styles.uploadContainer}>
                  <CircularProgress
                    value={startProgress ? progress : 0}
                    showProgressValue={false}
                    inActiveStrokeColor="transparent"
                    activeStrokeColor={COLORS.tint3}
                    activeStrokeWidth={4}
                    radius={16}
                  />
                  {startProgress ? (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setHidden(true);
                        setStartProgress(false);
                      }}
                    >
                      <CancelIcon style={styles.progressInnerIcon} />
                    </TouchableWithoutFeedback>
                  ) : (
                    <TouchableWithoutFeedback
                      onPress={() => setStartProgress(true)}
                    >
                      <UploadIcon style={styles.progressInnerIcon} />
                    </TouchableWithoutFeedback>
                  )}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <CustomText style={styles.senderMessage}>{message}</CustomText>
        )}
        <View style={styles.details}>
          <View style={{ flexDirection: "row" }}>
            {!sent ? <NotSentIcon /> : seen ? <SeenIcon /> : <SentIcon />}
            <CustomText style={styles.time}>{time}</CustomText>
          </View>
          {isVoice ? (
            <View style={styles.fileDetails}>
              <CustomText style={styles.fileSize}>
                {generateVoiceDurationMilli(currentDuration)} /{" "}
                {generateVoiceDurationMilli(voiceDuration)}
              </CustomText>
            </View>
          ) : isFile ? (
            <View style={styles.fileDetails}>
              <CustomText style={styles.fileType}>{extension}</CustomText>
              <View style={styles.oval}></View>
              <CustomText style={styles.fileSize}>{fileSize}</CustomText>
            </View>
          ) : null}
        </View>
      </View>
    );
  else
    return (
      <View style={styles.receiverContainer}>
        <ReceiverTail style={styles.receiverTail} />
        <View style={styles.messageHeader}>
          <CustomText style={styles.specialist}>
            {i18n.language === "en"
              ? sender.eng_fullName
              : i18n.language === "fa"
              ? sender.fullName
              : i18n.language === "ar"
              ? sender.fullName
              : ""}
          </CustomText>
          <CustomText style={styles.speciality}>{`(${speciality})`}</CustomText>
        </View>
        {isPayment ? (
          <View>
            <CustomText style={styles.receiverMessage}>
              {paymentMessage}
            </CustomText>
            <CustomButton
              text={t("chatMessage:payment")}
              style={styles.paymentButton}
              onClick={() => Linking.openURL(paymentLink)}
            />
          </View>
        ) : isVoice ? (
          <View style={styles.voiceContainer}>
            {voicePath && (
              <Waveform
                containerStyle={styles.waveform}
                mode="static"
                ref={voiceRef}
                // path={require("../../../assets/recording-test.m4a")}
                path={voicePath}
                candleSpace={2}
                candleWidth={2}
                scrubColor={COLORS.primary}
                waveColor={COLORS.neutral_ad}
                onError={(err) => console.log("ERRR:", err)}
                onPlayerStateChange={(playerState) => {
                  console.log("playerState:", playerState);
                  setVoiceState(playerState);
                }}
                onCurrentProgressChange={(_currentProgress, _songDuration) => {
                  setCurrentDuration(_currentProgress);
                  setVoiceDuration(_songDuration);
                }}
              />
            )}
            <TouchableWithoutFeedback onPress={handleVoice}>
              <View>
                {!downloaded && !startProgress ? (
                  <DownloadIcon />
                ) : !downloaded && startProgress ? (
                  <CancelIcon />
                ) : voiceState == "playing" ? (
                  <PauseIcon />
                ) : (
                  <PlayIcon />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        ) : isFile ? (
          <TouchableWithoutFeedback onPress={openFile}>
            <View
              style={[styles.fileContainer, { justifyContent: "flex-end" }]}
            >
              <View style={styles.fileContainerBackground}></View>
              <CustomText
                style={styles.fileName}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {message}
              </CustomText>
              {/* <FileIcon style={styles.fileIcon} /> */}
              {downloaded ? (
                <FileIcon style={styles.fileIcon} />
              ) : msg_type === "image" ? (
                <View style={styles.uploadContainer}>
                  <CircularProgress
                    value={startProgress ? progress : 0}
                    showProgressValue={false}
                    inActiveStrokeColor="transparent"
                    activeStrokeColor={COLORS.tint3}
                    activeStrokeWidth={4}
                    radius={16}
                  />
                  {startProgress ? (
                    <TouchableWithoutFeedback
                      onPress={() => setStartProgress(false)}
                    >
                      <CancelIcon style={styles.progressInnerIcon} />
                    </TouchableWithoutFeedback>
                  ) : (
                    <TouchableWithoutFeedback
                      onPress={() => downloadFile(fileUrl)}
                    >
                      <DownloadIcon style={styles.progressInnerIcon} />
                    </TouchableWithoutFeedback>
                  )}
                </View>
              ) : null}
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <CustomText style={styles.receiverMessage}>{message}</CustomText>
        )}
        <View style={styles.details}>
          <CustomText style={styles.time}>{time}</CustomText>
          {isVoice ? (
            <View style={styles.fileDetails}>
              <CustomText style={styles.fileSize}>
                {generateVoiceDurationMilli(currentDuration)} /{" "}
                {generateVoiceDurationMilli(voiceDuration)}
              </CustomText>
            </View>
          ) : isFile ? (
            <View style={styles.fileDetails}>
              <CustomText style={styles.fileType}>{extension}</CustomText>
              <View style={styles.oval}></View>
              <CustomText style={styles.fileSize}>{fileSize}</CustomText>
            </View>
          ) : null}
        </View>
      </View>
    );
};

export default ChatMessage;

const styles = StyleSheet.create({
  senderContainer: {
    backgroundColor: COLORS.primary_100,
    borderRadius: 12,
    marginTop: 16,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  senderMessage: {
    fontFamily: "estedad",
    fontSize: 12,
    marginTop: 6,
    marginRight: 10,
    marginLeft: 18,
  },
  senderTail: {
    position: "absolute",
    bottom: 0,
    left: -6,
    zIndex: 0,
  },
  details: {
    marginHorizontal: 10,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  time: {
    fontFamily: "estedad",
    fontSize: 12,
    color: COLORS.neutral_86,
    marginLeft: 4,
    marginRight: 8,
  },
  receiverContainer: {
    backgroundColor: COLORS.neutral_f9,
    borderRadius: 12,
    marginTop: 16,
    alignSelf: "flex-end",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  receiverMessage: {
    fontFamily: "estedad",
    fontSize: 12,
    marginTop: 6,
    marginRight: 10,
    marginLeft: 18,
  },
  receiverTail: {
    position: "absolute",
    bottom: 0,
    right: -6,
    zIndex: 0,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  specialist: {
    fontFamily: "estedad_bold",
    fontSize: 14,
    marginLeft: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.tint2,
  },
  speciality: {
    fontFamily: "estedad",
    fontSize: 10,
    marginLeft: 14,
    marginRight: 8,
    color: COLORS.primary_900,
    paddingBottom: 5,
  },
  fileContainer: {
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginTop: 8,
  },
  fileContainerBackground: {
    backgroundColor: "#767680",
    opacity: 0.12,
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  fileIcon: {
    margin: 8,
  },
  fileName: {
    fontFamily: "estedad_regular",
    fontSize: 16,
    marginLeft: 16,
  },
  fileDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileSize: {
    fontFamily: "estedad_regular",
    fontSize: 11,
    opacity: 0.4,
  },
  fileType: {
    fontFamily: "estedad_regular",
    fontSize: 11,
    opacity: 0.4,
  },
  oval: {
    backgroundColor: COLORS.black,
    opacity: 0.4,
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    marginHorizontal: 4,
  },
  uploadContainer: {
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  progressInnerIcon: {
    position: "absolute",
  },
  voiceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginTop: 8,
  },
  waveform: {
    direction: "ltr",
    marginStart: 12,
    marginEnd: 32,
    height: 32,
    width: 140,
  },
  paymentButton: {
    marginTop: 12,
    width: "90%",
    height: 40,
    marginRight: 20,
    marginLeft: 20,
  },
});
