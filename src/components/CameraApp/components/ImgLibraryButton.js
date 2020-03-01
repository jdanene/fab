import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet, View, Image,StatusBar} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors, sizes} from "../../../constants/styles";
import * as ImagePicker from 'expo-image-picker';

const ImgLibraryButton = ({imgPreview, imgPickedCallback,outfitOption}) => {
    const [previewLoaded, setPreviewLoaded] = useState(false);

    const handleClick = async () => {
        StatusBar.setBarStyle('default', true);
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled===true){
            StatusBar.setBarStyle('light-content', true);
        }else{
            imgPickedCallback({uri:pickerResult.uri})
        }
    };

    return (

        <TouchableOpacity onPress={handleClick}>
            <View style={styles.imgLibraryButton}>
                {(imgPreview !== null && imgPreview !== undefined) ? <Image
                        source={{uri: imgPreview}}
                        style={styles.imgPreview}
                        onLoad={() => setPreviewLoaded(true)}
                    /> :
                    <Ionicons name="md-photos"
                              color={colors.general.white}
                              size={45}
                              style={styles.defaultIcon}/>}
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    imgLibraryButton: {
        width: 50,
        height: 50,
        borderWidth: .1,
    },
    imgPreview: {
        // Setting up image width.
        width: 50,

        marginLeft: sizes.mini.fontSize,

        // Setting up image height.
        height: 45,

        // Set border width.
        borderWidth: 1,

        borderRadius: 10,
        // Set border color.
        borderColor: colors.general.white
    },
    defaultIcon: {
        width: 50,
        marginLeft: sizes.mini.fontSize,
        height: 45,
        // Set border color.
        color: colors.general.white
    }
});

export default ImgLibraryButton;