# fab

## Description
A mobile web app where users can post pictures of two outfit options and a community of users can provide feedback on which looks better.

## System Requirements
- npm 6.13.7+ 
- [Node 10 LTS](https://nodejs.org/en/download/) or greater installed
- expo-cli 
- firebase 

## Installation
The app uses Firebase as cloud storage and it uses Firebase as a NoSQL database, so to use the app you must set up Firebase. 

### Linking Firebase and Fab
A few steps are needed to connect Firebase and fab-app.

#### Create a Firebase project for fab-app
You do this with your browser on [the Firebase web console](https://console.firebase.google.com/). Follow [these instructions](https://firebase.google.com/docs/web/setup).

#### Initialize Firebase in fab-app before using
If you follow the intructions you will come across a [firebase config object](https://support.google.com/firebase/answer/7015592). Copy the firebase config object and navigate to the file located at the path `./src/db/init.js`, replace the [firebase config object in this file](https://github.com/cs394-w20/fab/blob/master/src/db/init.js#L5) with your own. 


### Installing Expo CLI
Next install [npm](https://www.npmjs.com/get-npm). Assuming that you have [Node 10 LTS](https://nodejs.org/en/download/) or greater installed, use npm to install the Expo CLI command line utility:
`npm install -g expo-cli` 

# Launching App
1. Download the [expo app](https://expo.io/tools) on your phone. 

2. Using your terminal/command prompt navigate to the directory with all the code then type:
`npm i` 
this will install all the required  packages for the app. <br>
2. Next type: 
`expo start --tunnel`

A QR code will now pop up, scan the QR code with the camera from your phone. The app will now be running on your phone. 

