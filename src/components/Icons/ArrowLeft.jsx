import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ArrowLeft = ({ style, rotate }) => {
  return (
    <Svg
      width={9}
      height={18}
      viewBox="0 0 9 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={rotate ? [style, { transform: [{ rotateY: "180deg" }] }] : style}
    >
      <Path
        d="M8 17.67c-.19 0-.38-.07-.53-.22L.95 10.93a2.74 2.74 0 010-3.86L7.47.55c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06L2.01 8.13c-.48.48-.48 1.26 0 1.74l6.52 6.52c.29.29.29.77 0 1.06-.15.14-.34.22-.53.22z"
        fill="#868686"
      />
    </Svg>
  );
};

export default ArrowLeft;
