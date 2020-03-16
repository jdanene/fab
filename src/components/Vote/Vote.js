import React, { useEffect, useState, useContext, useRef } from "react"
import { View, StyleSheet, Platform } from "react-native"
import VoteScreen from "./VoteScreen"
import fb from "../../db/init"
import closeRoom from "../../db/closeRoom"
import { colors } from "../../constants/styles"
import { getNumberOfVoters } from "../../db/Utility"
import moment from "moment"
import Swiper from 'react-native-deck-swiper';
import Constants from 'expo-constants';
import { VoteContext } from "./VoteContext/VoteContext";
import Loader from "../FancyLoader/FancyLoader";
import NoMoreRooms from "./NoMoreRooms";
const db = fb.database();


const getTotalNumVoters = room => {
  const {
    numInfluencersA,
    numNormalA,
    numInfluencersB,
    numNormalB
  } = getNumberOfVoters(room)
  return numInfluencersA + numNormalA + numInfluencersB + numNormalB
}


const noPreviousVote = ({ room, userID }) => {
  if (("voters_normal" in room["optionA"]) && (userID in room["optionA"]["voters_normal"])) {
    return false;
  }
  if (("voters_influencer" in room["optionA"]) && (userID in room["optionA"]["voters_influencer"])) {
    return false;
  }
  if (("voters_normal" in room["optionB"]) && (userID in room["optionB"]["voters_normal"])) {
    return false;
  }
  if (("voters_influencer" in room["optionB"]) && (userID in room["optionB"]["voters_influencer"])) {
    return false;
  }
  return true;
}

const roomStillActive = ({ room, roomID }) => {
  if (moment(room["meta_data"]["time_created"]).isBefore(moment().subtract(1, 'days'))) {
    closeRoom({ roomID: roomID });
    return false;
  }
  return true;
};


const getActiveList = ({rooms,seenSet}) => {
  let activeRooms = [];

  for (let roomID of Object.keys(rooms)) {
    seenSet.add(roomID);

    if (roomStillActive({ roomID: roomID, room: rooms[roomID] })) {
      getTotalNumVoters(rooms[roomID]);

      if (rooms[roomID]["meta_data"]["owner"] !== Constants.installationId &&
        noPreviousVote({ room: rooms[roomID], userID: Constants.installationId })) {
        const currRoom = {
          numVotes: getTotalNumVoters(rooms[roomID]),
          id: roomID
        };
        activeRooms.push(currRoom)
      }
    }
  }

  activeRooms.sort((a, b) => (a.numVotes > b.numVotes ? 1 : -1));

  return activeRooms
};

const Vote = () => {
  const [hasSwipedAll, setHasSwipedAll] = useState(false);
  const { roomlist, setRoomList, currentRoom, setCurrentRoom, swiper } = useContext(VoteContext);
  const seenSet = useRef(new Set());
  const [roomsNext, setRoomsNext] = useState({});

  useEffect(() => {
    const getRooms = async () => {
      const snapshot = await db.ref("rooms/active/").once("value");
      const activeList = getActiveList({rooms:snapshot.val()||{},seenSet:seenSet.current});
      setRoomList(activeList);
      setCurrentRoom(0)
    };
    getRooms().then(()=> listenForNewRooms());

    return ()=>db.ref('rooms/active/').off('child_added')
  }, []);


  /**
   * Anytime new rooms gets created add it to the roomsNext list - skip rooms already seen
   */
  const listenForNewRooms = () =>{
      const processDataCallback = async snap => {
        if (snap.exists() && !(seenSet.current.has(snap.key))) {
          let room = {[snap.key]:snap.val()};
          setRoomsNext({...roomsNext,...room});
        }
      };
    db.ref('rooms/active/').on('child_added',processDataCallback,(e)=>alert(`[Vote]${e}`));
  };


  /**
   * First check if there are any roomsNext. Then check if user has swiped all or roomlist = []. If this is the case
   * then getNewRooms using the values of roomsNext as input, afterwards reset roomsNext to the empty object.
   */
  useEffect(()=>{

    if (Object.keys(roomsNext).length!==0){
      if (hasSwipedAll || roomlist.length === 0){
        getNewRooms({rooms:roomsNext});
        setRoomsNext({});
      }
    }

  },[hasSwipedAll,roomlist,roomsNext]);


  const getNewRooms =  ({rooms}) => {
    const activeList =  getActiveList({rooms,seenSet:seenSet.current});
    setRoomList(activeList);
    setCurrentRoom(0);
    setHasSwipedAll(false)
  };

  /*
  currently loading
  */
  if (!roomlist) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Loader visible={true} />
    </View>
  }

  // swiped all but new rooms are available
  if ((Object.keys(roomsNext).length!==0) && hasSwipedAll){
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Loader visible={true} />
    </View>
  }

  return (roomlist.length && !hasSwipedAll?
    <View style={styles.container}>
      <Swiper
        cards={roomlist}
        renderCard={(card) => { return <VoteScreen roomInfo={card} /> }}
        onSwiped={(cardIndex) => { setCurrentRoom(cardIndex) }}
        onSwipedAll={() => { setHasSwipedAll(true) }}
        cardIndex={currentRoom}
        backgroundColor={colors.general.white}
        stackSize={3}
        ref={swiper}
        useViewOverflow={Platform.OS === 'ios'}
      >
      </Swiper>
    </View> :<NoMoreRooms/>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  card: {
    flex: 1,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white"
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent"
  }
});


export default Vote
