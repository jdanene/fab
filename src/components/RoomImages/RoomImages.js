import React, { useState, useEffect, forwardRef } from "react"
import {
  View,
  Image,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback
} from "react-native"
import PropTypes from "prop-types"
import ImageViewer from "react-native-image-zoom-viewer"

let x =
  "https://firebasestorage.googleapis.com/v0/b/fabapp-a1ea0.appspot.com/o/my-image.jpg?alt=media&token=995d6347-0435-41ac-96e1-91106786ab2c"

//const testPictures = 'https://i.imgur.com/VakBHis.jpg';

const RoomImages = props => {
  const {
    roomData,
    selectedOption,
    imageLoadCallback,
    setImageViewport
  } = props
  console.log(props)
  console.log(selectedOption)
  console.log(roomData)

  //roomData.room.optionA.picture = testPictures;
  //roomData.room.optionB.picture = testPictures;

  const [isImageOpen, setIsImageOpen] = useState(false)
  const [areImagesLoaded, setAreImagesLoaded] = useState({
    A: false,
    B: false
  })

  useEffect(() => {
    if (areImagesLoaded.A === true && areImagesLoaded.B === true) {
      imageLoadCallback()
    }
  }, [areImagesLoaded])

  return (
    <View
      style={styles.container}
      onLayout={event => {
        const { x, y, width, height } = event.nativeEvent.layout
        setImageViewport({ x, y, width, height })
      }}
    >
      {/*Modal for image zoom-in + expansion*/}
      {isImageOpen.state && (
        <Modal visible={isImageOpen.state}>
          <ImageViewer
            enableImageZoom
            enableSwipeDown
            onSwipeDown={() => setIsImageOpen({ state: false })}
            imageUrls={[
              {
                url: isImageOpen.url
              }
            ]}
          />
        </Modal>
      )}

      <View style={styles.photo_option}>
        <TouchableWithoutFeedback
          onPress={() =>
            setIsImageOpen({
              state: true,
              url: roomData.room.optionA.picture
            })
          }
        >
          <Image
            source={{ uri: roomData.room.optionA.picture }}
            style={styles.image}
            onLoad={() => setAreImagesLoaded({ ...areImagesLoaded, A: true })}
          />
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.photo_option}>
        <TouchableWithoutFeedback
          onPress={() =>
            setIsImageOpen({
              state: true,
              url: roomData.room.optionB.picture
            })
          }
        >
          <Image
            source={{ uri: roomData.room.optionB.picture }}
            style={styles.image}
            onLoad={() => setAreImagesLoaded({ ...areImagesLoaded, B: true })}
          />
        </TouchableWithoutFeedback>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  photo_option: {
    width: "48.5%",
    height: "100%",
    borderColor: "#A9A9A9",
    borderWidth: 0.5,
    backgroundColor: "#E8E8E8",
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover"
  },
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "space-around",
    flexDirection: "row"
  }
})

RoomImages.propTypes = {
  roomData: PropTypes.object.isRequired,
  selectedOption: PropTypes.string,
  imageLoadCallback: PropTypes.func
}

export default RoomImages
