import React, { useEffect, useState } from "react"
import * as Font from "expo-font"
import { StyleSheet, StatusBar } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Navigation } from "./src/Navigation/"
import {AppContextProvider} from "./src/context/AppContext";
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import  {colors}  from "./src/constants/styles"

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between"
  }
})


const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary.main,
    accent: colors.secondary.main,
    placeholder:colors.text.secondary.light,
    text:colors.text.primary.main
  },
  font:{
    ...DefaultTheme.fonts,
    regular:{
      fontFamily: 'source-sans-pro-regular',
      fontWeight: 'normal'
    }
  }
};



const App = () => {
  const [isFontLoaded, setisFontLoaded] = useState(false)
  useEffect(() => {
    StatusBar.setBarStyle('default', true);
    const load = async () => {
      /*
        To add more of the fonts, go see what's in assets/fonts
        Add it to the object loading async below, and set the key to a kebab-cased version of the font name
      */
      await Font.loadAsync({
        "source-sans-pro-regular": require("./assets/fonts/SourceSansPro-Regular.ttf"),
        "source-sans-pro-bold": require("./assets/fonts/SourceSansPro-Bold.ttf"),
        "source-sans-pro-semibold": require("./assets/fonts/SourceSansPro-SemiBold.ttf")
      })
      setisFontLoaded(true)
    }

    load()
  }, []);
  return (
    isFontLoaded && (

          <SafeAreaProvider>
            <AppContextProvider>
              <PaperProvider theme={theme}>
                <Navigation />
              </PaperProvider>
            </AppContextProvider>
          </SafeAreaProvider>
    )
  )
};

export default App
