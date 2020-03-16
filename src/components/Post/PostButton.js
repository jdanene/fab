import moment from "moment";
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import StyledText from "../StyledText/StyledText";
import createRoom from "../../db/createRoom";
import {colors, sizes, normalize} from "../../constants/styles";
import React, {useState, useEffect,useContext} from "react"
import uploadImage from "../../db/uploadImg";
import { ActivityIndicator } from 'react-native-paper';
import { screens } from "../../Navigation/constants"
import { useNavigation } from "@react-navigation/native"
import { AppContext } from "../../context/AppContext";


/**
 * Checks if a parameter (or key) exists
 * @param key
 */
const _uriExist = ({uri}) => {
    return (uri !== null && uri !== undefined)
};


const PostButton = ({title, outfitA, outfitB, postFinishedCallback}) => {
    const defaultTitle='Which one should I choose?';

    const navigation = useNavigation();
    const [outfitA_url, setOutfitA_url] = useState(null);
    const [outfitB_url, setOutfitB_url] = useState(null);
    const [urlsLoaded, setUrlsLoaded] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const {userID} = useContext(AppContext);


    useEffect(() => {
        if ((outfitA_url !== null && outfitB_url !== null) && (!urlsLoaded)) {
            setUrlsLoaded(true);

            // upload data to Db
            const currInstant = moment().toISOString();

            createRoom({userId:userID, time_created: currInstant, title:(title===''?defaultTitle:title), outfitA_url, outfitB_url})
                .then((roomID) => {

                    // reset state variables
                    setOutfitA_url(null);
                    setOutfitB_url(null);
                    setUrlsLoaded(null);
                    setIsPressed(false);
                    postFinishedCallback();


                    // Navigate to MyPosts
                    navigation.navigate(screens.RESULTS, { screen: screens.POSTS_PAGE });

        });

        }
    }, [outfitA_url, outfitB_url]);

    const uploadCallback_A = ({url}) => {
        setOutfitA_url(url)
    };

    const uploadCallback_B = ({url}) => {
        setOutfitB_url(url)
    };

    const handlePress = async () => {
        if (!_uriExist(outfitA) && !_uriExist(outfitB)) {
            alert("Please take a photo");
        } else if (_uriExist(outfitA) && !_uriExist(outfitB)) {
            alert("Please take a photo for option B");
        } else if (!_uriExist(outfitA) && _uriExist(outfitB)) {
            alert("Please take a photo for option A");
        } else {
            setIsPressed(true);
            // Upload the images to firebase storage and capture the urls
            uploadImage({outfit:outfitA, uploadCallback: uploadCallback_A});
            uploadImage({outfit:outfitB, uploadCallback: uploadCallback_B});
        }

    };

    return (
        isPressed ?
            <View style={styles.container}>
                 <ActivityIndicator animating={true} color={colors.general.white} />
            </View>
            :
            <TouchableOpacity onPress={handlePress}>

                <View style={styles.container}>
                    <StyledText size={sizes.xlarge.fontSize} style={styles.text}> POST </StyledText>
                </View>
            </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: normalize(40),
        width: normalize(140),
        backgroundColor: colors.primary.main,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    text: {
        color: colors.general.white
    }
});


PostButton.defaultProps = {
    title: "Scoopdi woop poop"
};

export default PostButton;
