import React from "react"
import { CameraApp } from "../../components/CameraApp";
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import PostPage from "../../components/Post/PostPage";
const Stack = createStackNavigator();


const Post = () => {
    return (
        <Stack.Navigator gestureDirection="vertical"
            initialRouteName={"PostPage"}
            screenOptions={
                {
                    gestureDirection: 'vertical-inverted',
                    gestureEnabled: true,
                    headerShown: false,
                    cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
                }
            }>
            <Stack.Screen name="PostPage" component={PostPage} />
            <Stack.Screen name="CameraApp" component={CameraApp} />
        </Stack.Navigator>
    )
};



export default Post
