import React from "react"
import { TouchableOpacity, StyleSheet } from "react-native"
import { colors} from "../../../constants/styles"
import { StyledText } from "../../StyledText"

const SkipButton = ({ onPress, style, ...rest }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.button, ...style }}
      onPress={onPress}
      {...rest}
    >
      <StyledText size={16} style={{ color: colors.primary.main }}>
        SKIP
      </StyledText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderColor: colors.primary.main,
    borderWidth: 2,
    paddingHorizontal: 48,
    paddingVertical: 4
  }
});

export default SkipButton
