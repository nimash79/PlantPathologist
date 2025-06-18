import Svg, { Path } from "react-native-svg"

const SentIcon = (props) => {
  return (
    <Svg
      width={12}
      height={11}
      viewBox="0 0 12 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M.57 6.936l3.09 3.09c.139.14.369.127.494-.026l7.249-8.932A.333.333 0 0011.354.6l-.647-.525a.333.333 0 00-.469.05l-6.2 7.64a.333.333 0 01-.494.026L1.63 5.876a.333.333 0 00-.471 0l-.59.589a.333.333 0 000 .471z"
        fill="#003A06"
      />
    </Svg>
  )
}

export default SentIcon;