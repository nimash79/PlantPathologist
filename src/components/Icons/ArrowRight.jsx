import Svg, { Path } from "react-native-svg"

const ArrowRight = (props) => {
  return (
    <Svg
      width={9}
      height={18}
      viewBox="0 0 7 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M.94 11.78a.495.495 0 01-.354-.147.503.503 0 010-.706L4.933 6.58a.82.82 0 000-1.16L.586 1.073a.503.503 0 010-.706.503.503 0 01.707 0L5.64 4.713c.34.34.533.8.533 1.287 0 .487-.187.947-.533 1.287l-4.347 4.346a.524.524 0 01-.353.147z"
        fill="#868686"
      />
    </Svg>
  )
}

export default ArrowRight;
