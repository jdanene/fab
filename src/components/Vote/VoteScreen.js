import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useContext
} from "react"
import { View, Dimensions, StyleSheet } from "react-native"
import { VoteButton, SkipButton } from "./VoteButton"
import updateVotes from "../../db/updateVotes"
import getVoteData from "../../db/getVoteData"
import getRoomData from "../../db/getRoomData"
import closeRoom from "../../db/closeRoom"
import { colors, normalize } from "../../constants/styles"
import CountDown from "../countdown/CountDown"
import { RoomImages } from "../RoomImages"
import { RoomTitle } from "../RoomTitle"
import Loader from "../FancyLoader/FancyLoader"
import { AppContext } from "../../context/AppContext"
import { Surface } from "react-native-paper"
import { VoteContext } from "./VoteContext/VoteContext"
import VoteResults from "./VoteResults"
import fb from "../../db/init"
const db = fb.database()


const VoteScreen = ({ roomInfo }) => {
  const [voteState, setVoteState] = useState({})
  const [areImagesLoaded, setAreImagesLoaded] = useState(false)
  const [imageViewport, setImageViewport] = useState({})
  const { user, userID, isLoggedIn } = useContext(AppContext)
  const { swiper } = useContext(VoteContext)
  const [roomData, setRoomData] = useState(null)
  const autoMoveNextTimeout = useRef();

  // continuously get data
  useEffect(() => {
    const handleData = snapshot => {
      snapshot.val() && setRoomData(snapshot.val())
    }

    db.ref("rooms/active/")
      .child(roomInfo.id)
      .on("value", handleData, error => alert(`[VoteScreen]${error}`))

    return () =>
      {
        db.ref("rooms/active/").child(roomInfo.id).off("value", handleData)
        if (autoMoveNextTimeout.current){
          clearTimeout(autoMoveNextTimeout.current);
        }
      }
  }, [])

  const handlePress = async selection => {
    const roomID = roomInfo.id
    const voteResults = await updateVotes({
      roomID: roomID,
      selection: selection,
      userID: userID,
      badge: user.meta_data.badge
    })
    setVoteState({
      ...voteState,
      selectedOption: selection,
      voteResults
    })

    /*
        Janky settimeout to show results for 1.5 seconds
    */

    const delay = 3000;
    autoMoveNextTimeout.current = setTimeout(() => {
      swiper.current.swipeTop()
      setVoteState({})
      setAreImagesLoaded(false)
    }, delay)
  }

  const handleSkip = () => {
    setAreImagesLoaded(false)
    swiper.current.swipeTop()
  }

  const imageLoadCallback = () => {
    setAreImagesLoaded(true)
  }

  const isFinishedCallback = () => {
    const roomID = roomInfo.id
    closeRoom({ roomID }).then(() => {
      getRoomData({ roomID }).then(roomData => {
        const voteResults = getVoteData(roomData)
        setVoteState({
          ...voteState,
          selectedOption: null,
          voteResults
        })
      })
    })
  }

  return roomData && isLoggedIn ? (
    <Surface
      style={{
        height: "96%",
        width: normalize(310),
        alignSelf: "center",
        borderRadius: 30,
        borderWidth: 0.5,
        borderColor: "rgba(0,0,0,.1)"
      }}
    >
      <View>
        <View style={styles.container}>
          {/*
        black screen overlay and vote results over images
        */}

          {/*Room Title*/}
          <View style={styles.title_container}>
            <RoomTitle title={roomData.meta_data.title} />
          </View>
          {/*Room Images*/}

          <View style={styles.photo_container}>
            <RoomImages
              roomData={roomData}
              selectedOption={voteState.selectedOption}
              imageLoadCallback={imageLoadCallback}
              setImageViewport={setImageViewport}
              voting={true}
            />
          </View>

          {voteState.voteResults && (
            <VoteResults
              scoreA={voteState.voteResults.scoreA}
              scoreB={voteState.voteResults.scoreB}
              viewport={imageViewport}
              selectedOption={voteState.selectedOption}
            />
          )}

          <View
            style={{
              width: "100%",
              height: "48%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {voteState.voteResults ? (
              <></>
            ) : areImagesLoaded ? (
              <View style={styles.buttons_and_timer_container}>
                <View style={styles.buttons_container}>
                  <View style={styles.options_container_text}>
                    <View
                      size={normalize(18)}
                      style={styles.option_text}
                    ></View>
                    <VoteButton
                      content="A"
                      onPress={() => handlePress("optionA")}
                    />
                  </View>

                  <View style={styles.options_container_text}>
                    <View
                      size={normalize(18)}
                      style={styles.option_text}
                    ></View>
                    <VoteButton
                      content="B"
                      onPress={() => handlePress("optionB")}
                    />
                  </View>
                </View>

                <SkipButton onPress={handleSkip} style={styles.skip_button} />
                <CountDown
                  startTime={roomData.meta_data.time_created}
                  isFinished={isFinishedCallback}
                />
              </View>
            ) : (
              <View style={styles.loading_container}>
                <Loader />
              </View>
            )}
          </View>
        </View>
      </View>
    </Surface>
  ) : (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Loader visible={true} />
    </View>
  )
}

{
  /*<Loader />*/
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  photo_container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: "40%"
  },

  buttons_and_timer_container: {
    alignItems: "center",
    flexDirection: "column",
    height: normalize(220),
    width: "100%"
  },
  buttons_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%"
  },
  title_container: {
    height: "12%",
    width: "95%",
    alignItems: "center",
    justifyContent: "center"
  },
  loading_container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  },
  options_container_text: {
    alignItems: "center"
  },
  option_text: {
    paddingTop: normalize(5),
    color: colors.text.secondary.main,
    paddingBottom: normalize(20)
  },
  skip_button: {
    marginTop: normalize(8),
    marginBottom: normalize(8)
  }
})

export default VoteScreen
