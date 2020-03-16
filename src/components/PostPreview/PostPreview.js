import React, { useEffect, useState } from "react"
import { View, TouchableHighlight, StyleSheet, Image, Dimensions } from "react-native"
import moment from "moment"
import { screens } from "../../Navigation/constants"
import getMyPostData from "../../db/getMyPostData"
import { useNavigation } from "@react-navigation/native"
import { StyledText } from "../StyledText"
import { Ionicons } from '@expo/vector-icons';
import CountDown from "../../components/countdown/CountDown"
import { normalize, sizes } from "../../constants/styles";

const winnerPicture = ({ postData }) => {
  return (postData.scoreA >= postData.scoreB) ? postData.pictureA : postData.pictureB;
}


const PostPreview = ({ roomID, userInfo }) => {
  const navigation = useNavigation()
  const [postData, setPostData] = useState(null)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    const getPostData = async () => {
      const data = await getMyPostData({ roomID });
      let createdAt;
      let now = moment();

      const today = moment().endOf('day');
      const yesterday = moment().subtract(1, 'day').endOf('day');
      const twoDaysAgo = moment().subtract(2, 'day').endOf('day');
      let moment_createdAt = moment(data.timeCreated);

      if (moment_createdAt.isBetween(yesterday, today)) {
        createdAt = `Today ${moment_createdAt.format("h:mm A")}`
      } else if (moment_createdAt.isBetween(twoDaysAgo, yesterday)) {
        createdAt = `Yesterday ${moment_createdAt.format("h:mm A")}`
      } else if (now.diff(moment_createdAt, 'years') < 1) {
        createdAt = moment_createdAt.format("ddd, MMM Do h:mm A")
      }
      else {
        createdAt = moment_createdAt.format("MMM Do YYYY h:mm A")
      }


      setPostData({
        ...data,
        createdAt: createdAt
      });
    };
    getPostData()
  }, []);

  const isFinishedCallback = () => {
    setIsFinished(true)
  };

  return postData ? (
    <TouchableHighlight
      onPress={() =>
        navigation.navigate(screens.RESULTS, {
          roomID: roomID,
          roomData: postData
        })
      }
      style={styles.container}
      underlayColor="#F4F4F4"
    >
      <View style={styles.innerContainer}>
        <Image source={{ uri: winnerPicture({ postData: postData }) }} style={styles.image} resizeMode={'cover'} />
        <View style={styles.textWrapper}>
          <View style={styles.timeWrapper}>
            <StyledText style={styles.timeText}>{postData.createdAt}</StyledText>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.titleWrapper}>
              <StyledText type={"semibold"} > {postData.title} </StyledText>
            </View>
            {(isFinished) ? (
              <View style={styles.iconWrapper}>
                <Ionicons style={styles.icon} name="md-checkmark-circle" size={45} color="#DD8300" />
              </View>
            ) : (

                <View style={styles.countDownWrapper}>
                  <CountDown
                    startTime={postData.timeCreated}
                    isFinished={isFinishedCallback}
                    prettyFormat={true}
                  />
                </View>

              )}
          </View>
        </View>
      </View>
    </TouchableHighlight>
  ) : (
      <StyledText>Loading...</StyledText>
    )
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    marginBottom: 2,
    padding: 16
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: 110,
    width: normalize(300)
  },
  timeWrapper: {
    width: normalize(222)
  },
  textWrapper: {
    marginLeft: normalize(5),
    width: '60%',
    height: 110
  },
  timeText: {
    fontFamily: "source-sans-pro-regular",
    color: "#d3d3d3",
    marginRight: 10,
    fontSize: sizes.small.fontSize
  },
  text: {

  },
  image: {
    aspectRatio: 2 / 3,
    height: 75,
    width: 75,
    borderRadius: 3,
    borderColor: 'rgba(0,0,0,.1)',
    borderWidth: 1
  },
  icon: {

  },
  titleWrapper: {
    width: normalize(150),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: 85
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: normalize(85),
    alignSelf: 'flex-end',
    height: 85
  },
  countDownWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: normalize(85),
    height: 85
  }
})
export default PostPreview
