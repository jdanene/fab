import React, { useEffect, useState, useContext } from "react"
import {
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl
} from "react-native"
import { PostPreview } from "../../components/PostPreview"
import { StyledText } from "../../components/StyledText"
import { AppContext } from "../../context/AppContext"
import { colors, normalize, sizes } from "../../constants/styles"
import fb from "../../db/init"
import Loader from "../../components/FancyLoader/FancyLoader"
import Constants from "expo-constants"
import moment from "moment"
const db = fb.database()

const MyPostsPage = () => {
  const userID = Constants.installationId
  const { user, isLoggedIn } = useContext(AppContext)
  const [userInfo, setUserInfo] = useState(null)
  const [refreshing, setRefreshing] = useState(null)

  const _handleData = snap => {
    if (snap.val()) {
      let user = snap.val()
      let roomsOwned = null
      if ("rooms_owned" in user) {
        const rooms = Object.entries(user.rooms_owned)
        const sortedRooms = rooms.sort(([a_key, a_val], [b_key, b_val]) => {
          return moment(a_val.time_created).isBefore(moment(b_val.time_created))
        })
        roomsOwned = sortedRooms.reduce((acc, curr) => {
          acc[curr[0]] = curr[1]
          return acc
        }, {})
      }

      user.rooms_owned = roomsOwned
      setUserInfo(user)
      setRefreshing(false)
    }
  }

  const _fetchData = async () => {
    await db
      .ref("users/")
      .child(userID)
      .once("value", _handleData, error => alert(error))
  }

  useEffect(() => {
    db.ref("users/")
      .child(userID)
      .on("value", _handleData, error => alert(error))
    return () => {
      db.ref("users/")
        .child(userID)
        .off("value", _handleData)
    }
  }, [])

  return isLoggedIn && userInfo ? (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.general.white,
        width: "100%",
        height: "100%"
      }}
    >
      <View
        style={{
          height: normalize(120),
          borderBottomWidth: 5,
          borderColor: colors.text.secondary.light
        }}
      >
        <UserStats user={userInfo} />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={_fetchData} />
        }
      >
        {userInfo.rooms_owned ? (
          Object.keys(userInfo.rooms_owned).map(roomID => (
            <PostPreview roomID={roomID} user={user} key={roomID} />
          ))
        ) : (
          <NoPostMessage />
        )}
      </ScrollView>
    </SafeAreaView>
  ) : (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Loader visible={true} />
    </View>
  )
}

const NoPostMessage = () => (
  <View
    style={{
      width: "100%",
      marginTop: 24,
      paddingHorizontal: 32
    }}
  >
    <StyledText
      type="semibold"
      style={{
        textAlign: "center"
      }}
      size={normalize(26)}
      color={colors.primary.main}
    >
      No posts yet
    </StyledText>
    <StyledText
      style={{
        textAlign: "center",
        marginTop: 32
      }}
      size={normalize(26)}
      color={colors.primary.main}
    >
      Head to the Post page to submit a new post!
    </StyledText>
  </View>
)

const UserStats = ({ user }) => (
  <View
    style={{
      flexDirection: "row",
      backgroundColor: colors.general.white,
      paddingTop: "8%",
      paddingLeft: "8%",
      paddingRight: "8%"
    }}
  >
    <View style={{ flex: 1 }}>
      <StyledText
        size={sizes.xlarge.fontSize}
        style={{ color: colors.text.secondary.light }}
      >
        My Stats
      </StyledText>
      <StyledText
        size={sizes.xlarge.fontSize}
        style={{ color: colors.text.secondary.main }}
      >
        <Badge badge={user.meta_data.badge} />
      </StyledText>
    </View>
    <View style={{ flex: 1 }}>
      <PostCount
        count={user.rooms_owned ? Object.keys(user.rooms_owned).length : 0}
      />
      <VoteCount count={user.meta_data.number_voted} />
      <PercentCorrect
        percent={Math.ceil(
          (user.meta_data.number_correct * 100) / user.meta_data.number_voted
        )}
        numVotes={user.meta_data.number_voted}
      />
    </View>
  </View>
)

const Badge = ({ badge }) => {
  if (badge === "influencer")
    return (
      <StyledText
        size={sizes.large.fontSize}
        type="bold"
        style={{ color: colors.secondary.main }}
      >
        INFLUENCER
      </StyledText>
    )
  return null
}

const PostCount = ({ count }) => (
  <View
    style={{
      flexDirection: "row",
      borderBottomColor: colors.text.secondary.light,
      borderBottomWidth: 1,
      alignItems: "center"
    }}
  >
    <View style={{ width: "50%" }}>
      <StyledText
        size={sizes.medium.fontSize}
        style={{
          color: colors.text.secondary.main,
          textAlign: "right",
          paddingRight: 5
        }}
      >
        Posts
      </StyledText>
    </View>
    <StyledText
      size={sizes.large.fontSize}
      style={{ color: colors.text.secondary.main, paddingLeft: 5 }}
    >
      {count}
    </StyledText>
  </View>
)

const VoteCount = ({ count }) => (
  <View style={{ flexDirection: "row", paddingTop: 5, alignItems: "center" }}>
    <View style={{ width: "50%" }}>
      <StyledText
        size={sizes.medium.fontSize}
        style={{
          color: colors.text.secondary.main,
          textAlign: "right",
          paddingRight: 5
        }}
      >
        Votes
      </StyledText>
    </View>
    <StyledText
      size={sizes.large.fontSize}
      style={{ color: colors.primary.light, paddingLeft: 5 }}
    >
      {count}
    </StyledText>
  </View>
)

const PercentCorrect = ({ percent, numVotes }) => {
  if (numVotes !== 0) {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ width: "50%" }}>
          <StyledText
            size={sizes.medium.fontSize}
            style={{
              color: colors.text.secondary.main,
              lineHeight: 15,
              paddingTop: 5,
              textAlign: "right",
              paddingRight: 5
            }}
          >
            Percent Correct
          </StyledText>
        </View>
        <View style={{ flexDirection: "row", position: "relative" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <StyledText
              size={sizes.large.fontSize}
              style={{ color: colors.primary.light, paddingLeft: 5 }}
            >
              {percent}
            </StyledText>
            <StyledText
              size={sizes.medium.fontSize}
              style={{ color: colors.primary.light, bottom: 0 }}
            >
              %
            </StyledText>
          </View>
        </View>
      </View>
    )
  }
  return null
}

export default MyPostsPage
