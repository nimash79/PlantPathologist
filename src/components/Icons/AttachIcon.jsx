import Svg, { Path } from "react-native-svg"

const AttachFileIcon = (props) => {
  return (
    <Svg
      width={21}
      height={18}
      viewBox="0 0 21 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M9.253 1.318l8.132 8.132a3.999 3.999 0 010 5.657 3.999 3.999 0 01-5.657 0l-8.839-8.84a2.5 2.5 0 013.536-3.535l7.424 7.425a1.003 1.003 0 010 1.414 1.003 1.003 0 01-1.414 0L5.718 4.854l-1.061 1.06 6.717 6.718a2.5 2.5 0 003.536-3.536L7.485 1.672a3.999 3.999 0 00-5.657 0 3.999 3.999 0 000 5.656l8.84 8.84a5.497 5.497 0 007.777 0 5.497 5.497 0 000-7.779L10.314.257 9.253 1.318z"
        fill="#868686"
      />
    </Svg>
  )
}

export default AttachFileIcon;
