import * as React from "react"
import Svg, { Path } from "react-native-svg"

const FileIcon = (props) => {
  return (
    <Svg
      width={17}
      height={24}
      viewBox="0 0 17 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.7.391l.576.008.285.001 5.934 6.397V21.1c0 1.16-.887 2.1-1.982 2.1H2.623c-1.094 0-1.981-.94-1.981-2.1V2.5c0-1.16.887-2.1 1.981-2.1H9.7V.39zm0 1.208L2.623 1.6c-.469 0-.849.403-.849.9v18.6c0 .497.38.9.85.9h11.89c.469 0 .849-.403.849-.9V7.64l-3.68-.04C10.587 7.6 9.7 6.66 9.7 5.5L9.7 1.6zM10.833 5.5V2.405l3.736 4.027-2.88-.032c-.476 0-.856-.403-.856-.9z"
        fill="#024227"
      />
    </Svg>
  )
}

export default FileIcon;