import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CustomText from "./CustomText";
import { COLORS } from "../../utils/constants";

const CustomLink = ({
  children,
  style,
  onClick,
  withoutUnderlay = false,
  ...props
}) => {
  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View>
        <CustomText
          style={withoutUnderlay ? [styles.text, {textDecorationLine: "none"}, style] : [styles.text, style]}
          {...props}
        >
          {children}
        </CustomText>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomLink;

const styles = StyleSheet.create({
  text: {
    fontFamily: "estedad_bold",
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
});
