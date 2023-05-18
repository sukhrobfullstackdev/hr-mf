// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage} from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCt9HucMp-o_p8ScGd18K7LYXBZwzZOxDw",
    authDomain: "hr-minfin.firebaseapp.com",
    projectId: "hr-minfin",
    storageBucket: "hr-minfin.appspot.com",
    messagingSenderId: "948327491566",
    appId: "1:948327491566:web:a4b481b9affa85043ed0ff",
    measurementId: "G-RYPJNLECTP"
};

// Initialize Firebase
const firebaseApp = initializeApp ( firebaseConfig );
const messaging = getMessaging ( firebaseApp );
export const getCurrentToken = (setFbmToken) => {
    return getToken(messaging, {vapidKey: process.env.REACT_APP_FBM_KEY}).then((currentToken) => {
        if (currentToken) {
            setFbmToken(currentToken)
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
}
export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });