import Svg, { Path } from "react-native-svg"

const CancelIcon = (props) => {
  return (
    <Svg
      width={10}
      height={10}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M9 1L1 9m8 0L1 1"
        stroke="#363853"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export default CancelIcon;
