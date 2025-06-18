import React, { useEffect, useRef, useState } from "react";
import { I18nManager, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import "react-native-reanimated";
import "react-native-gesture-handler";
import * as Splash from "expo-splash-screen";
import { Provider } from "react-redux";
import * as Updates from "expo-updates";
import { useTranslation } from "react-i18next";
import Constants from "expo-constants";

import store from "./src/redux/store";
import { toastConfig } from "./src/utils/alert";
import IntroScreen from "./src/screens/IntroScreen";
import Authentication from "./src/screens/authentication/Authentication";
import Toast from "react-native-toast-message";
import PersonalInformationScreen from "./src/screens/settings/PersonalInformationScreen";
import ContactUsScreen from "./src/screens/settings/ContactUsScreen";
import ConversationsScreen from "./src/screens/main/ConversationsScreen";
import ChatScreen from "./src/screens/main/ChatScreen";
import { COLORS } from "./src/utils/constants";
import LanguageScreen from "./src/screens/LanguageScreen";
import "./src/localization/i18n";
import { getLanguage } from "./src/utils/data_storage";
import AboutUsScreen from "./src/screens/settings/AboutUsScreen";
import FaqScreen from "./src/screens/settings/FaqScreen";
import SettingsScreen from "./src/screens/settings/SettingsScreen";
import ViewFile from "./src/screens/main/ViewFile";
import HomeScreen from "./src/screens/main/HomeScreen";
import SelectSpecialistScreen from "./src/screens/main/SelectSpecialistScreen";


const Stack = createNativeStackNavigator();


Splash.preventAutoHideAsync();

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// function handleRegistrationError(errorMessage) {
//   console.log(errorMessage);
//   throw new Error(errorMessage);
// }

// async function registerForPushNotificationsAsync() {
//   if (Platform.OS === "android") {
//     Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//   }
//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;
//   if (existingStatus !== "granted") {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }
//   if (finalStatus !== "granted") {
//     handleRegistrationError(
//       "Permission not granted to get push token for push notification!"
//     );
//     return;
//   }
//   const projectId =
//     Constants?.expoConfig?.extra?.eas?.projectId ??
//     Constants?.easConfig?.projectId;
//   if (!projectId) {
//     handleRegistrationError("Project ID not found");
//   }
//   try {
//     const res = await Notifications.getExpoPushTokenAsync({
//       projectId,
//     });
//     console.log(res);
//     const pushTokenString = (
//       await Notifications.getExpoPushTokenAsync({
//         projectId,
//       })
//     ).data;
//     console.log(pushTokenString);
//     return pushTokenString;
//   } catch (e) {
//     console.log("Error happened");
//     handleRegistrationError(`${e}`);
//   }
// }

export default function App() {
  const [appIsReady, setAppIsReady] = useState();
  const [loaded] = useFonts({
    peyda: require("./assets/fonts/peyda/Peyda-Medium.ttf"),
    peyda_bold: require("./assets/fonts/peyda/Peyda-Bold.ttf"),
    peyda_semibold: require("./assets/fonts/peyda/Peyda-SemiBold.ttf"),
    peyda_extrabold: require("./assets/fonts/peyda/Peyda-ExtraBold.ttf"),
    iransans_num_bold: require("./assets/fonts/iransans/IRANSansDN_FaNum-Bold.ttf"),
    estedad: require("./assets/fonts/estedad/Estedad-Medium.ttf"),
    estedad_bold: require("./assets/fonts/estedad/Estedad-Bold.ttf"),
    estedad_semibold: require("./assets/fonts/estedad/Estedad-SemiBold.ttf"),
    estedad_regular: require("./assets/fonts/estedad/Estedad-Regular.ttf"),
  });

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  const { i18n } = useTranslation();

  useEffect(() => {
    // registerForPushNotificationsAsync()
    //   .then((token) => setExpoPushToken(token ?? ""))
    //   .catch((error) => setExpoPushToken(`${error}`));

    // notificationListener.current =
    //   Notifications.addNotificationReceivedListener((notification) => {
    //     setNotification(notification);
    //   });

    // responseListener.current =
    //   Notifications.addNotificationResponseReceivedListener((response) => {
    //     console.log(response);
    //   });

    (async () => {
      const lang = await getLanguage();
      if (lang) {
        I18nManager.forceRTL(lang !== "en");
        if (lang !== i18n.language) {
          i18n.changeLanguage(lang);
          await Updates.reloadAsync();
        }
      }
    })();
    // return () => {
    //   notificationListener.current &&
    //     Notifications.removeNotificationSubscription(
    //       notificationListener.current
    //     );
    //   responseListener.current &&
    //     Notifications.removeNotificationSubscription(responseListener.current);
    // };
  }, []);

  useEffect(() => {
    (async () => {
      if (loaded) {
        await Splash.hideAsync();
        setAppIsReady(true);
      }
    })();
  }, [loaded]);
  if (!loaded) return null;
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Language" component={LanguageScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SelectSpecialist" component={SelectSpecialistScreen} />
          <Stack.Screen name="Authentication" component={Authentication} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen
            name="PersonalInformation"
            component={PersonalInformationScreen}
          />
          <Stack.Screen name="Faq" component={FaqScreen} />
          <Stack.Screen name="AboutUs" component={AboutUsScreen} />
          <Stack.Screen name="ContactUs" component={ContactUsScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Conversations" component={ConversationsScreen} />
          <Stack.Screen name="ViewFile" component={ViewFile} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
      <StatusBar style={COLORS.black} backgroundColor={COLORS.tint1} />
    </Provider>
  );
}
