import fb from "./init";
import * as firebase from "firebase";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import {Platform} from 'react-native';
const shortid = require('shortid');

const dbStorage = fb.storage();


/**
 * Compress image
 * @see https://stackoverflow.com/questions/50257879/expo-camera-takepictureasync-imagemanipulator
 * @see https://stackoverflow.com/questions/50257879/expo-camera-takepictureasync-imagemanipulator
 * @param uri
 */
const compressImage = async ({outfit}) => {

    let originalInfo = await FileSystem.getInfoAsync(outfit.uri, {'size': true});

    let resizedPhoto = await ImageManipulator.manipulateAsync(
        outfit.uri,
        [],
        {compress: Platform.OS === 'ios'?0:.5, format: "jpeg", base64: false}
    );
    let compressedInfo = await FileSystem.getInfoAsync(resizedPhoto.uri, {'size': true});

    const directoryName = FileSystem.documentDirectory + 'images';
    const fileName = `${directoryName}/outfit${outfit.outfitOption}.jpeg`;

    await FileSystem.makeDirectoryAsync(directoryName,{'intermediates':true});
    await FileSystem.moveAsync({from: resizedPhoto.uri, to: fileName});

    return fileName;
};

const uploadImage = async ({outfit, uploadCallback}) => {

    // compress image
    const compressedUri = await compressImage({outfit});

    // Get the type of file. Either png or jpeg usually
    let splitUri = compressedUri.split('.');
    let fileType = splitUri[splitUri.length - 1];

    // Turn the compressedUri into a file object
    const response = await fetch(compressedUri);
    const blob = await response.blob();

    // Upload to fire storage
    let filename = `${shortid.generate()}${new Date().valueOf()}.${fileType}`;
    let ref = dbStorage.ref().child(filename);
    let uploadTask = ref.put(blob);


    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: 
                break;
            case firebase.storage.TaskState.RUNNING: 
                break;
        }
    }, function (error) {
        // Handle unsuccessful uploads
    }, function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            uploadCallback({url})
        });
    });


};

export default uploadImage;
