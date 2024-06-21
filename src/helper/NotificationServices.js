import AsyncStorage from '@react-native-async-storage/async-storage';
import {messaging} from '@react-native-firebase/messaging';
import {PermissionsAndroid,Platform} from 'react-native';
import notifee from '@notifee/react-native';
import Toast from 'react-native-toast-message';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';


export async function requestUserPermission() {

  const granted =  await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  if(granted === PermissionsAndroid.RESULTS.DENIED)
  {
    if(Platform.OS == 'android' && Platform.Version >= 33){
      const permissionResult =  await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    
      if(permissionResult !== PermissionsAndroid.RESULTS.GRANTED){
        console.log('Permission not granted!');
        Toast.show({
          type: 'info',
          text1: 'Permission not granted!'
        })
        return;
      }
    
    }

  }

  getFCMToken();


    // console.log("PermissionsAndroid.RESULTS.granted",PermissionsAndroid.RESULTS.GRANTED)
    // if(Platform.OS == 'android' && Platform.Version >= 33){
    // const granted =  await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    // console.log("grantedgranted",granted)
    // if(granted === PermissionsAndroid.RESULTS.GRANTED){
    //     getFCMToken()
    // }else{
    //     console.log("permission denied")
    // }
    // }else{
    //     const authStatus = await messaging().requestPermission();
    //     const enabled =
    //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
    //     if (enabled) {
    //       console.log('Authorization status:', authStatus);
    //       getFCMToken()
    //     }
    // }
}

const getFCMToken = async () => {
    try {
        
        let fcmToken = await AsyncStorage.getItem('fcm_token');

        console.log("FCM TOKEN :: ",fcmToken) 

        if(!!fcmToken){
           console.log("OLD FCM_TOKEN FOUND",fcmToken) 
        }else{
            await messaging().registerDeviceForRemoteMessages();
            const token = await messaging().getToken();
            console.log("_TOKEN",token) 
            await AsyncStorage.setItem('fcm_token', token)
            console.log("NEW FCM_TOKEN",token) 
        }
    } catch (error) {
        console.log("error during generating token",error)
    }
}


export async function onDisplayNotification(title,body) {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }
