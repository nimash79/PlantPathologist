import Svg, { Path } from "react-native-svg";

const ReceiverTail = (props) => {
  return (
    <Svg
      width={12}
      height={15}
      viewBox="0 0 12 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M.839 14.13c3.72-4.007 4.873-7.462 5.11-12.012.028-.527.762-.695.998-.224l4.87 9.74a.483.483 0 01-.146.611c-3.138 2.242-7.477 2.67-10.464 2.742-.446.01-.671-.53-.368-.857z"
        fill="#F9F9F9"
      />
    </Svg>
  );
};

export default ReceiverTail;
