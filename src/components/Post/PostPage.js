import React, {useEffect, useState} from "react"
import {View, StyleSheet, TouchableWithoutFeedback, Keyboard} from "react-native"
import {SafeAreaView} from "react-native-safe-area-context"
import PostButton from "./PostButton";
import {colors, normalize} from "../../constants/styles";
import PostPhoto from "./PostPhoto";
import TitleEntry from "./TitleEntry";

// The actual post page
const PostPage = ({route, navigation}) => {
    const placeHolderText = 'Enter title here';
    const [outfitA, setOutfitA] = useState({uri: undefined, outfitOption: 'A'});
    const [outfitB, setOutfitB] = useState({uri: undefined, outfitOption: 'B'});
    const [roomTitle, setRoomTitle] = useState('');


    useEffect(() => {
        // Set the tabbar to visible just in case - we remove this for the camera
        navigation.setOptions({
            tabBarVisible: true
        });

        // get data for the options
        // use the `uri' to display data
        // use the `base64' to send data
        if (route.params !== undefined) {
            if (route.params.outfitOption === 'A') {
                setOutfitA({uri: route.params.uri, outfitOption: 'A', base64: route.params.base64});
            }
            if (route.params.outfitOption === 'B') {
                setOutfitB({uri: route.params.uri, outfitOption: 'B', base64: route.params.base64});
            }
        }

    }, [route]);

    /**
     * Called when picture is closed
     */
    const onPictureCloseCallback = (outfit) => {
        if (outfit.outfitOption === 'A') {
            setOutfitA({uri: undefined, outfitOption: 'A'})
        }

        if (outfit.outfitOption === 'B') {
            setOutfitB({uri: undefined, outfitOption: 'B'})
        }
    };

    const onTitleChangeCallBack = (text)=>{
        setRoomTitle(text)
    };

    /**
     * Called after user hits the post button - clean up state
     */
    const onPostFinished = () => {
        setOutfitA({uri: undefined, outfitOption: 'A'});
        setOutfitB({uri: undefined, outfitOption: 'B'});
        setRoomTitle('');
    };

    return (
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>

            <SafeAreaView style={styles.container}>

                <View style={styles.title_container}>
                    <TitleEntry onTitleChangeCallBack={onTitleChangeCallBack} placeholderText={placeHolderText} roomTitle={roomTitle}/>
                </View>

                <View style={styles.photos_container}>
                    <PostPhoto outfit={outfitA} onCloseCallback={onPictureCloseCallback} />
                    <PostPhoto outfit={outfitB} onCloseCallback={onPictureCloseCallback}/>
                </View>


                <PostButton title={roomTitle} outfitA={outfitA} outfitB={outfitB}
                            postFinishedCallback={onPostFinished}/>
            </SafeAreaView>
        </TouchableWithoutFeedback>

    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },

    photos_container: {
        flexDirection: 'row',
        width: '100%',
        height: '40%',
        justifyContent: 'space-around',
        marginBottom: normalize(100)
    },

    title_container: {
        borderColor: colors.general.black,
        height: '15%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }

});

export default PostPage;
