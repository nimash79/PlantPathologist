import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Constants from "expo-constants";

import { COLORS } from "../../utils/constants";
import BackIcon from "../../components/Icons/BackIcon";
import CustomText from "../../components/Shared/CustomText";
import LittleStepsFilledIcon from "../../components/Icons/ProfileIcons/LittleStepsFilledIcon";

const ViewFile = ({ navigation, route }) => {
  const [uri, setUri] = useState();
  const [extension, setExtension] = useState();
  useEffect(() => {
    setUri(route.params.uri);
    setExtension(route.params.uri);
  }, [route.params]);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <View style={styles.backIcon}>
            <BackIcon />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.headerTextContainer}>
          <CustomText style={styles.headerText}>گیاهپزشک</CustomText>
          <View style={styles.headerTextBorder}></View>
        </View>
        <LittleStepsFilledIcon color={COLORS.primary} style={{ opacity: 0 }} />
      </View>
      <Image source={{ uri }} style={styles.image} resizeMode="contain" />
    </View>
  );
};

export default ViewFile;

const styles = StyleSheet.create({
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
  image: {
    width: "100%",
    height: "100%",
  },
});
