import React, {
  useState
} from "react"
import { View, StyleSheet } from "react-native"
import { StyledText } from "../StyledText"
import { colors, normalize, sizes } from "../../constants/styles"

const VoteResults = props => {
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 30
      }}
    >
      {/*Get the container from for title from VoteScreen to align container below - hack */}
      <View style={styles.title_container} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: props.viewport.height,
          width: props.viewport.width
        }}
      >
        {props.scoreA === 0 && props.scoreB === 0 && (
          <View
            style={{
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <StyledText
              type="bold"
              style={{ color: "white", fontSize: sizes.large.fontSize }}
            >
              You've made the first vote.
            </StyledText>
            <StyledText
              style={{ color: "white", fontSize: sizes.medium.fontSize }}
            >
              So far you are 100%!
            </StyledText>
          </View>
        )}

        {(props.scoreA !== 0 || props.scoreB !== 0) && (
          <View
            style={{
              width: "50%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <VotePercents
              score="A"
              scoreA={props.scoreA}
              scoreB={props.scoreB}
              imageViewport={props.viewport}
            />
          </View>
        )}

        {(props.scoreB !== 0 || props.scoreA !== 0) && (
          <View
            style={{
              width: "50%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <VotePercents
              score="B"
              scoreA={props.scoreA}
              scoreB={props.scoreB}
              imageViewport={props.viewport}
            />
          </View>
        )}
      </View>

      {props.selectedOption && (
        <YourVote selectedOption={props.selectedOption} />
      )}
    </View>
  )
}

const VotePercents = props => {
  const textStyles = {
    color: "white",
    fontSize: normalize(30)
  }
  const borderStyles = {
    height: normalize(80),
    width: normalize(80),
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: normalize(5)
  }
  var borderColors =
    props.scoreA > props.scoreB
      ? { borderA: colors.secondary.main, borderB: "transparent" }
      : { borderB: colors.secondary.main, borderA: "transparent" }
  if (props.scoreA === props.scoreB) {
    borderColors = { borderA: "transparent", borderB: "transparent" }
  }
  return props.score === "A" ? (
    <View style={{ ...borderStyles, borderColor: borderColors.borderA }}>
      <View
        style={{
          flexDirection: "row",
          height: normalize(40),
          width: normalize(60),
          justifyContent: "center"
        }}
      >
        <StyledText
          type={"bold"}
          style={{ ...textStyles, alignSelf: "flex-end" }}
        >
          {((props.scoreA / (props.scoreA + props.scoreB)) * 100).toFixed()}
        </StyledText>
        <StyledText
          style={{
            ...textStyles,
            fontSize: sizes.small.fontSize,
            alignSelf: "flex-end",
            marginBottom: normalize(5)
          }}
        >
          %
        </StyledText>
      </View>
    </View>
  ) : (
      <View style={{ ...borderStyles, borderColor: borderColors.borderB }}>
        <View
          style={{
            flexDirection: "row",
            height: normalize(40),
            width: normalize(60),
            justifyContent: "center"
          }}
        >
          <StyledText
            type={"bold"}
            style={{ ...textStyles, alignSelf: "flex-end" }}
          >
            {((props.scoreB / (props.scoreA + props.scoreB)) * 100).toFixed()}
          </StyledText>
          <StyledText
            style={{
              ...textStyles,
              fontSize: sizes.small.fontSize,
              alignSelf: "flex-end",
              marginBottom: normalize(5)
            }}
          >
            %
        </StyledText>
        </View>
      </View>
    )
}

const YourVote = ({ selectedOption }) => {
  const [height, setHeight] = useState(null)

  return (
    <View
      onLayout={e => setHeight(e.nativeEvent.layout.height)}
      style={{
        backgroundColor: colors.secondary.main,
        width: "49%",
        left: selectedOption === "optionA" ? 0 : "51%",
        top: height ? -height : 0,
        alignItems: "center",
        paddingVertical: 8
      }}
    >
      <StyledText
        size={sizes.medium.fontSize}
        type={"regular"}
        style={{ color: colors.general.white }}
      >
        YOUR VOTE
      </StyledText>
    </View>
  )
}

const styles = StyleSheet.create({
  title_container: {
    height: "12%",
    width: "95%",
    alignItems: "center",
    justifyContent: "center"
  }
})

export default VoteResults
