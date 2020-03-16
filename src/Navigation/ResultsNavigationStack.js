import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { Results, MyPostsPage } from "../views"
import { screens } from "./constants"
import { colors } from "../constants/styles";

const Stack = createStackNavigator()

const ResultsNavigationStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={screens.POSTS_PAGE}
    >
      <Stack.Screen
        component={MyPostsPage}
        name={screens.POSTS_PAGE}
        options={{ title: "My Posts", headerShown: false }}
      />

      <Stack.Screen
        component={Results}
        name={screens.RESULTS}
        options={{
          title: '',
          headerStyle: {
            backgroundColor: colors.general.white,
          }
        }} />
    </Stack.Navigator>
  )
}

export default ResultsNavigationStack
