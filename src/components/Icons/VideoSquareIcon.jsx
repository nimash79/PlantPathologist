import * as React from "react"
import Svg, { Path } from "react-native-svg"

const VideoSquareIcon = (props) => {
  return (
    <Svg
      width={25}
      height={24}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M16.69 2H8.31C4.67 2 2.5 4.17 2.5 7.81v8.37C2.5 19.83 4.67 22 8.31 22h8.37c3.64 0 5.81-2.17 5.81-5.81V7.81C22.5 4.17 20.33 2 16.69 2zm-1.53 11.73l-1.28.74-1.28.74c-1.65.95-3 .17-3-1.73v-2.96c0-1.91 1.35-2.68 3-1.73l1.28.74 1.28.74c1.65.95 1.65 2.51 0 3.46z"
        fill="#0FA064"
      />
    </Svg>
  )
}

export default VideoSquareIcon;
