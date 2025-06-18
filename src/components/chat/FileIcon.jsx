import Svg, { Path } from "react-native-svg";

const FileIcon = (props) => {
  return (
    <Svg
      width={24}
      height={29}
      viewBox="0 0 24 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 2.5A1.5 1.5 0 012.5 1h13.98a1.5 1.5 0 011.06.438l5.02 5.008A1.5 1.5 0 0123 7.508V26.5a1.5 1.5 0 01-1.5 1.5h-19A1.5 1.5 0 011 26.5v-24z"
        fill="#fff"
        stroke="#D1D1D6"
        strokeWidth={0.4}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23 7.5h-5A1.5 1.5 0 0116.5 6V1a1.5 1.5 0 011.04.438l5.02 5.008c.28.28.438.658.44 1.054z"
        fill="#EFEFEF"
      />
      <Path
        d="M23 7.5v.2h.201l-.001-.2H23zM16.5 1l.003-.2L16.3.798V1h.2zm1.04.438l-.142.142.141-.142zm5.02 5.008l-.142.141.141-.141zM23 7.3h-5v.4h5v-.4zm-5 0A1.3 1.3 0 0116.7 6h-.4A1.7 1.7 0 0018 7.7v-.4zM16.7 6V1h-.4v5h.4zm-.203-4.8a1.3 1.3 0 01.9.38l.283-.283A1.7 1.7 0 0016.503.8l-.006.4zm.9.38l5.021 5.007.283-.283-5.02-5.007-.283.283zm5.021 5.007c.243.243.38.571.382.914l.4-.002a1.7 1.7 0 00-.5-1.195l-.282.283z"
        fill="#D1D1D6"
      />
      <Path
        d="M9.6 10.1v.8h7.3v-.8H9.6zM7.1 19.1v.8h7.3v-.8H7.1zM7.1 13.1v.8h9.8v-.8H7.1zM7.1 16.1v.8h9.8v-.8H7.1z"
        fill="#007AFF"
      />
    </Svg>
  );
};

export default FileIcon;
