import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import BottomNavbar from "./BottomNavbar"

const Stack = createStackNavigator()

const Navigation = () => {
  return (
    <NavigationContainer>
      <BottomNavbar />
    </NavigationContainer>
  )
}

export default Navigation
