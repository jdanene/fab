import React from "react"
import Svg, { G, Path, Circle } from "react-native-svg"
const PostCamera = ({ color }) => (
  <Svg width="28px" height="22px" viewBox="0 0 28 22">
    <G
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <G
        transform="translate(-10.000000, -13.000000)"
        stroke={color}
        strokeWidth="2"
      >
        <G transform="translate(11.000000, 14.000000)">
          <Path d="M17.55,1.18423789e-15 L8.45,1.18423789e-15 L5.85,3.33333333 L1.95021433,3.33333333 C0.876618922,3.33333333 0,4.22610453 0,5.32739361 L0,18.0059397 C0,19.1054862 0.871357456,20 1.94623135,20 L24.0522812,20 C25.1279766,20 26,19.1054862 26,18.0059397 L26,5.32739361 C26,4.22610453 25.1233811,3.33333333 24.0497857,3.33333333 L20.15,3.33333333 L17.55,1.18423789e-15 Z"></Path>
          <Circle cx="13.5" cy="10.5" r="4.5"></Circle>
        </G>
      </G>
    </G>
  </Svg>
)

export default PostCamera
