import {View, Image, Modal, ImageBackground, StyleSheet, StatusBar, TouchableWithoutFeedback,TouchableOpacity} from "react-native"
import PropTypes from 'prop-types';
import ImageViewer from "react-native-image-zoom-viewer";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from "react"
import {colors, normalize} from "../../constants/styles";
import { Ionicons } from '@expo/vector-icons';
import getVoteData from "../../db/getVoteData"

let x =
  "https://firebasestorage.googleapis.com/v0/b/fabapp-a1ea0.appspot.com/o/my-image.jpg?alt=media&token=995d6347-0435-41ac-96e1-91106786ab2c"


const RoomImages = props => {
  const {
    roomData,
    imageLoadCallback,
    setImageViewport,
    voting, isFinished
  } = props;

  const [isImageOpen, setIsImageOpen] = useState(false)
  const [areImagesLoaded, setAreImagesLoaded] = useState({
    A: false,
    B: false
  })
  const [winningImage, setWinningImage] = useState("")

  const closeImage = () => {
      StatusBar.setHidden(false,'slide');
    StatusBar.setBarStyle('default',true);
    setIsImageOpen({state:false});
  }
  const openImageB =() =>{
    StatusBar.setBarStyle('light-content',true);
    setIsImageOpen({
        state: true,
        url: roomData.optionB.picture
    })
  }
  const openImageA = () => {
    StatusBar.setBarStyle('light-content',true);
    setIsImageOpen({
        state: true,
        url: roomData.optionA.picture
    })
  }

  useEffect(() => {
    if (areImagesLoaded.A === true && areImagesLoaded.B === true) {
      imageLoadCallback()
    }

    const votes = getVoteData(roomData)
    console.log("UPDATED VOTE DATA: ", votes)
    if (voting) {
      setWinningImage("")
    }
    else {
      if (votes.scoreA > votes.scoreB) {
        setWinningImage("A")
      }
      else if (votes.scoreB > votes.scoreA) {
        setWinningImage("B")
      }
      else {
        setWinningImage("TIE")
      }  
    }

    console.log("IMAGE: ", winningImage)

  }, [areImagesLoaded])

    // sets hides or shows the status bar depending on if the image expander is open
    useEffect(()=>{
        if (isImageOpen.state){
            StatusBar.setHidden(true,'none');
        }else{
            StatusBar.setHidden(false,'slide');
            StatusBar.setBarStyle('default',true);
        }

    },[isImageOpen.state]);

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
            <View style={{width:'100%',height:'100%',backgroundColor:'black'}}>
                <TouchableOpacity
                    onPress={closeImage}
                    style={{
                        height: normalize(40),
                        width:normalize(40),
                        marginLeft:normalize(0),
                        marginTop:0,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                     <Ionicons name="md-close" size={32} color="white" />
                </TouchableOpacity>
                <ImageViewer
                            renderIndicator={()=>{}}
                            enableImageZoom
                            enableSwipeDown
                            enablePreload
                            onSwipeDown={() => setIsImageOpen({ state: false })}
                            imageUrls={[
                              {
                                url: isImageOpen.url
                              }
                            ]}
                          />
            </View>
        </Modal>
      )}
      <View style={styles.photo_container}>
        <View style={styles.photo_option}>
              <TouchableWithoutFeedback
                  onPress={() =>
                      openImageA()
                  }>
                  <ImageBackground source={{uri:roomData.optionA.picture}} style={styles.image} onLoad={() =>
                      setAreImagesLoaded({...areImagesLoaded, A: true})}>
                      <MaterialCommunityIcons style={styles.icon_shadow}  name="arrow-expand" size={32} color="white" onPress={() =>
                         openImageA()
                      }/>
                  </ImageBackground>
              </TouchableWithoutFeedback>
          </View>
          {(winningImage == "A") && isFinished ? (
              <View style={styles.icon_container}>
                  <Ionicons style={styles.icon} name="md-checkmark-circle" size={50} color="#DD8300" />
              </View>
          ) : (
            <View></View>
          )}
        </View>

        <View style={styles.photo_container}>
          <View style={styles.photo_option}>
              <TouchableWithoutFeedback
                  onPress={() =>
                      openImageB()
                  }>
                  <ImageBackground source={{uri:roomData.optionB.picture}} style={styles.image} onLoad={() =>
                          setAreImagesLoaded({...areImagesLoaded, B: true})}>
                          <MaterialCommunityIcons style={styles.icon_shadow} name="arrow-expand" size={32} color="white" onPress={() =>
                             openImageB()
                          }/>
                  </ImageBackground>
              </TouchableWithoutFeedback>
          </View>
          {(winningImage == "B") && isFinished ? (
              <View style={styles.icon_container}>
                  <Ionicons style={styles.icon} name="md-checkmark-circle" size={50} color="#DD8300" />
              </View>
          ) : (
            <View></View>
          )}
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  photo_container: {
    width: "50%",
  },
  photo_option: {
    height: "100%",
    width: "100%",
    borderColor: "#A9A9A9",
    borderWidth: 0.5,
    backgroundColor: "#E8E8E8",
    borderRadius: 2
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover"
  },
  container: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    backgroundColor: 'transparent'
  },
  icon_shadow:{
      shadowOpacity: .5,
      shadowRadius: 2,
      shadowColor:'#000000',
      textShadowOffset:{width: 5,height: 2},
      textShadowRadius: 10,
      shadowOffset: {
          width: 1,            // Same rules apply from above
          height: 0,           // Can't both be 0
      }
  },
    icon: {
      height:50,
      width:50,
      textAlign:'center',
  },
    icon_container:{
        bottom: normalize(18),
        left: normalize(65),
        alignItems:'center',
        justifyContent:'center',
        height:40,
        width:40,
        backgroundColor:'white',
        borderRadius: 40/2
    }
});

RoomImages.propTypes = {
  roomData: PropTypes.object.isRequired,
  selectedOption: PropTypes.string,
  imageLoadCallback: PropTypes.func
}

RoomImages.defaultProps = {
    isFinished: false
};

export default RoomImages
