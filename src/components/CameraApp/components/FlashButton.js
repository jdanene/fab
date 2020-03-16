import React from 'react';
import { TouchableOpacity,  StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {sizes} from "../../../constants/styles";
import {CAMERA_FLASH_MODES}  from "../constants"
import {Camera} from "expo-camera";


const FlashButton = ({cameraFlashModeIdx,cameraFlashModeCallBack})=>{
    return(
        <TouchableOpacity
            onPress={cameraFlashModeCallBack}
            style={styles.container}
        >
            <Ionicons
            name={(CAMERA_FLASH_MODES[cameraFlashModeIdx] === Camera.Constants.FlashMode.on) ? "md-flash" : 'md-flash-off'}
            color="white"
            size={30}
            style={styles.icon}
            />
        </TouchableOpacity>
    )
};

const styles =  StyleSheet.create({
    container:{
        top: sizes.mini.fontSize,
        left:sizes.mini.fontSize,
        position: 'absolute',
        width:50,
        height:50,
        justifyContent: 'center',
        alignItems: 'center'
    },
   icon:{
        shadowOpacity: .5,
        shadowRadius: 2,
       shadowColor:'#000000',
        textShadowOffset:{width: 5,height: 2},
        textShadowRadius: 10,
        shadowOffset: {
            width: 1,            // Same rules apply from above
            height: 0,           // Can't both be 0
        }
    }
});

export default FlashButton;