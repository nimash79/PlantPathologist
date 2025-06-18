import { Text } from "react-native";

const CustomText = ({ children, style = null , ...props}) => {
  return <Text style={style} {...props}>{children}</Text>;
};

export default CustomText;
