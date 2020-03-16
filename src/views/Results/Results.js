import React, { useEffect, useState } from "react"
import getVoteData from "../../db/getVoteData"
import closeRoom from "../../db/closeRoom"
import { View, StyleSheet } from "react-native"
import CountDown from "../../components/countdown/CountDown"
import { StyledText } from "../../components/StyledText"
import { colors, normalize, sizes } from "../../constants/styles"
import { RoomTitle } from "../../components/RoomTitle";
import { RoomImages } from "../../components/RoomImages";
import { VotingChart } from "../../components/VotingChart";
import fb from "../../db/init";
import { getNumberOfVoters } from "../../db/Utility";
import Loader from "../../components/FancyLoader/FancyLoader";
const db = fb.database();

export const createChartData = ({
  influencer,
  normal,
  competitor,
  totalNumVoters
}) => {
  const data = [
    {
      key: 3,
      amount: normal,
      svg: { fill: "#1563af" },
      totalNumVoters: totalNumVoters
    },
    {
      key: 2,
      amount: influencer,
      svg: { fill: "#dd8300" },
      totalNumVoters: totalNumVoters
    },
    {
      key: 1,
      amount: competitor,
      svg: { fill: "#f4f4f4" },
      totalNumVoters: totalNumVoters
    }
  ]
  return data
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    height: '100%'
  },
  photo_container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40%',
  },

  buttons_and_timer_container: {
    alignItems: "center",
    flexDirection: "column",
  },
  buttons_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '80%'
  },
  title_container: {
    height: '12%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading_container: {
    alignItems: "center",
    justifyContent: 'center',
    width: "100%",
    height: '100%',
  },
  options_container_text: {
    alignItems: "center"
  },
  option_text: {
    paddingTop: 5,
    color: colors.text.secondary.main
  },
  photo_option: {
    width: '48.5%',
    height: '100%',
    borderColor: '#A9A9A9',
    borderWidth: 0.5,
    backgroundColor: '#E8E8E8',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  sub_container: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  text_container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30
  },
  title: {
    color: "#1563af",
    fontSize: sizes.large.fontSize,
  },
  content: {
    color: "#1563af",
    fontSize: sizes.large.fontSize,
  },
  countdown_container: {
    paddingTop: 10
  },

});


// Gets the total number of voters
const getTotalNumVoters = roomData => {
  if (roomData) {
    let { numInfluencersA, numNormalA, numInfluencersB, numNormalB } = getNumberOfVoters(roomData);
    let scoreA = numNormalA + numInfluencersA;
    let scoreB = numNormalB + numInfluencersB;
    return scoreA + scoreB
  }
};

const Results = ({ route }) => {
  const [roomData, setRoomData] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const { roomID } = route.params;
    let isActive = false;
    let dbRef_active = db.ref('rooms/active/').child(roomID);

    const handleData = snapshot => {
      snapshot.val() && setRoomData(snapshot.val())
    };

    db.ref('rooms/active/').child(roomID).once('value')
      .then((_snap) => {
        // if active record exits use db.on() get live data
        if (_snap.exists()) {
          isActive = true;
          dbRef_active.on('value', handleData, (error) => alert(`[Results/active]${error}`))
        } else {
          // otherwise get the static data via db.once()
          db.ref('rooms/inactive/').child(roomID)
            .once('value')
            .then((snap) => setRoomData(snap.val()))
            .catch((e) => alert(`[Results/inactive]${e}`))
        }
      }).catch((e) => alert(`[Results]${e}`));


    return () => db.ref('rooms/active/').child(roomID).off('value', handleData)

  }, []);


  const isFinishedCallback = () => {
    closeRoom({ roomID: route.params.roomID });
    setIsFinished(true);
  };

  return roomData ? (

    <View style={styles.container}>
      <View style={styles.title_container}>
        <RoomTitle title={roomData.meta_data.title} />
      </View>

      <View style={styles.photo_container}>
        <RoomImages roomData={roomData} setImageViewport={() => { }} imageLoadCallback={() => { }} voting={false} isFinished={isFinished} />
      </View>


      {(getTotalNumVoters(roomData) !== 0) ? (
        <View style={{ marginTop: normalize(20) }}>
          <VotingChart voteResults={roomData && getVoteData(roomData)} />
        </View>
      ) : (
          <View style={styles.text_container}>
            <StyledText style={styles.title}>No votes yet.</StyledText>
            <StyledText style={styles.content}>Check back soon.</StyledText>
          </View>
        )
      }
      <View style={styles.countdown_container}>
        <CountDown startTime={roomData.meta_data.time_created} isFinished={isFinishedCallback} />
      </View>

    </View>
  ) : (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Loader visible={true} />
      </View>
    )
};

export default Results
