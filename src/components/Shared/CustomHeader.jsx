import { StyleSheet } from "react-native";
import CustomText from "./CustomText";

const CustomHeader = ({ children, style = null }) => {
  return <CustomText style={[styles.content, style]}>{children}</CustomText>;
};

export default CustomHeader;

const styles = StyleSheet.create({
  content: {
    fontStyle: "estedad_bold",
    fontSize: 20,
  },
});
