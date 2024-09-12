import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONT} from '../../assets/constants';
import SplashScreenGradientText from '../components/helpercComponent/SplashScreenGradientText';
import {onDisplayNotification} from '../helper/NotificationServices';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';
import notifee from '@notifee/react-native';
import Toast from 'react-native-toast-message';

const SplashScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    getUserAccessToken();
    requestUserPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      onDisplayNotification(
        remoteMessage?.notification?.title,
        remoteMessage?.notification?.body,
      );
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  const getUserAccessToken = async () => {
    try {
      const val = await AsyncStorage.getItem('accesstoken');
      console.log('From SS Access Token :: ' + val);
      // dispatch(getUserAccessToken(val));
      dispatch({
        type: 'getaccesstoken',
        payload: val,
      });

      const timer = setTimeout(() => {
        if (val) {
          navigation.navigate('Home');
        } else {
          navigation.navigate('Login');
          // navigation.navigate('Login');
        }
      }, 3000);
    } catch (error) {
      console.log('error' + error);
    }
  };

  const getFCMToken = async () => {
    console.log('Get FCM Started');
    try {
      let fcmToken = await AsyncStorage.getItem('fcm_token');

      console.log('FCM TOKEN :: ', fcmToken);
      if (!!fcmToken) {
        console.log('OLD FCM_TOKEN FOUND', fcmToken);
      } else {
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        console.log('_TOKEN', token);
        await AsyncStorage.setItem('fcm_token', token);
        console.log('NEW FCM_TOKEN', token);
      }
    } catch (error) {
      console.log('error during generating token', error);
    }
  };

  const requestUserPermission = async () => {
    console.log('requesting permission started');

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      console.log('requesting permission status :: ' + granted);
      if (!granted) {
        console.log('Permission status for all :: ' + granted);
        const permissionResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        if (permissionResult !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission not granted!');
          Toast.show({
            type: 'info',
            text1: 'Permission not granted!',
          });
          return;
        }
      }
    }

    getFCMToken(); // Call getFCMToken after ensuring permission
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white_s,
      }}>
      {/** Top View Rectangle View */}
      <View
        style={{
          width: heightPercentageToDP(30),
          height: heightPercentageToDP(30),
          backgroundColor: COLORS.white_s,
          position: 'absolute',
          borderRadius: heightPercentageToDP(5),
          zIndex: 0,
          top: heightPercentageToDP(29),
          left: widthPercentageToDP(20),
          elevation: heightPercentageToDP(2),
        }}>
        <View
          style={{
            width: heightPercentageToDP(15),
            height: heightPercentageToDP(30),
            backgroundColor: COLORS.lightWhite,
            position: 'absolute',
            zIndex: 1,
            borderTopLeftRadius: heightPercentageToDP(5),
            borderBottomLeftRadius: heightPercentageToDP(5),
          }}></View>
      </View>

      <ImageBackground
        source={require('../../assets/image/tlwbg.jpg')}
        style={{
          width: '70%',
          height: '100%',
        }}></ImageBackground>
      <View
        style={{
          backgroundColor: COLORS.grayHalfBg,
          width: widthPercentageToDP(50),
          flex: 1,
          opacity: 80,
          elevation: heightPercentageToDP(2),
        }}>
        <View
          className="rounded-full h-5 w-5"
          style={{
            margin: heightPercentageToDP(3),
            backgroundColor: COLORS.background,
          }}></View>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.grayHalfBg,
          position: 'absolute',
          top: '35%',
          left: '30%',
          padding: heightPercentageToDP(2),
          height: heightPercentageToDP(20),
          width: heightPercentageToDP(20),
        }}
        className="rounded-full ">
        <View
          style={{
            height: heightPercentageToDP(15),
            width: heightPercentageToDP(15),
            backgroundColor: COLORS.white_s,
            padding: heightPercentageToDP(2),
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
          className="rounded-full ">
          <Image
            source={require('../../assets/image/sincelogo.png')}
            resizeMode="contain"
            style={{
              height: heightPercentageToDP(15),
              width: heightPercentageToDP(15),
            }}
          />
        </View>
      </View>

      <View
        style={{
          backgroundColor: 'transparent',
          position: 'absolute',
          transform: [{rotate: '90deg'}],
          bottom: heightPercentageToDP(18),
          left: heightPercentageToDP(-14),
          zIndex: 2,
        }}>
        <SplashScreenGradientText
          style={{
            fontFamily: FONT.Montserrat_SemiBold,
            fontSize: heightPercentageToDP(6),
            marginStart: heightPercentageToDP(1),
            color: COLORS.golden,
          }}>
          SINCE 1927
        </SplashScreenGradientText>
      </View>

      <View
        style={{
          backgroundColor: 'transparent',
          transform: [{rotate: '90deg'}],
          position: 'absolute',
          zIndex: 2,
          top: heightPercentageToDP(42),
          right: widthPercentageToDP(-16),
        }}>
        <Text
          style={{
            fontFamily: FONT.ELEPHANT,
            fontSize: heightPercentageToDP(2.6),
            color: COLORS.golden,
          }}>
          THE LION WORLD
        </Text>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});

// import {
//   Alert,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useEffect} from 'react';
// import {useDispatch} from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   heightPercentageToDP,
//   widthPercentageToDP,
// } from 'react-native-responsive-screen';
// import {useNavigation} from '@react-navigation/native';
// import {COLORS, FONT} from '../../assets/constants';
// import SplashScreenGradientText from '../components/helpercComponent/SplashScreenGradientText';
// import {onDisplayNotification} from '../helper/NotificationServices';
// import messaging from '@react-native-firebase/messaging';
// import {PermissionsAndroid, Platform} from 'react-native';
// import notifee from '@notifee/react-native';
// import Toast from 'react-native-toast-message';

// const SplashScreen = () => {
//   // const dispatch = useDispatch();
//   // const navigation = useNavigation();

//   // useEffect(() => {
//   //   getUserAccessToken();
//   //   requestUserPermission();
//   // }, []);

//   // useEffect(() => {
//   //   const unsubscribe = messaging().onMessage(async remoteMessage => {
//   //     console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
//   //     onDisplayNotification(
//   //       remoteMessage?.notification?.title,
//   //       remoteMessage?.notification?.body,
//   //     );
//   //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
//   //   });

//   //   return unsubscribe;
//   // }, []);

//   // const getUserAccessToken = async () => {
//   //   try {
//   //     const val = await AsyncStorage.getItem('accesstoken');
//   //     console.log('From SS Access Token :: ' + val);
//   //     // dispatch(getUserAccessToken(val));
//   //     dispatch({
//   //       type: 'getaccesstoken',
//   //       payload: val,
//   //     });

//   //     const timer = setTimeout(() => {
//   //       if (val) {
//   //         navigation.navigate('Home');
//   //       } else {
//   //         navigation.navigate('Login');
//   //         // navigation.navigate('Login');
//   //       }
//   //     }, 3000);
//   //   } catch (error) {
//   //     console.log('error' + error);
//   //   }
//   // };

//   // const getFCMToken = async () => {
//   //   console.log('Get FCM Started');
//   //   try {
//   //     let fcmToken = await AsyncStorage.getItem('fcm_token');

//   //     console.log('FCM TOKEN :: ', fcmToken);
//   //     if (!!fcmToken) {
//   //       console.log('OLD FCM_TOKEN FOUND', fcmToken);
//   //     } else {
//   //       await messaging().registerDeviceForRemoteMessages();
//   //       const token = await messaging().getToken();
//   //       console.log('_TOKEN', token);
//   //       await AsyncStorage.setItem('fcm_token', token);
//   //       console.log('NEW FCM_TOKEN', token);
//   //     }
//   //   } catch (error) {
//   //     console.log('error during generating token', error);
//   //   }
//   // };

//   // const requestUserPermission = async () => {
//   //   console.log('requesting permission started');

//   //   if (Platform.OS === 'android' && Platform.Version >= 33) {
//   //     const granted = await PermissionsAndroid.check(
//   //       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//   //     );
//   //     console.log('requesting permission status :: ' + granted);
//   //     if (!granted) {
//   //       console.log('Permission status for all :: ' + granted);
//   //       const permissionResult = await PermissionsAndroid.request(
//   //         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//   //       );

//   //       if (permissionResult !== PermissionsAndroid.RESULTS.GRANTED) {
//   //         console.log('Permission not granted!');
//   //         Toast.show({
//   //           type: 'info',
//   //           text1: 'Permission not granted!',
//   //         });
//   //         return;
//   //       }
//   //     }
//   //   }

//   //   getFCMToken(); // Call getFCMToken after ensuring permission
//   // };

//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: COLORS.white_s,
//       }}>
//       {/** Top View Rectangle View */}
//       <View
//         style={{
//           width: heightPercentageToDP(30),
//           height: heightPercentageToDP(30),
//           backgroundColor: COLORS.white_s,
//           position: 'absolute',
//           borderRadius: heightPercentageToDP(5),
//           zIndex: 0,
//           top: heightPercentageToDP(29),
//           left: widthPercentageToDP(20),
//           elevation: heightPercentageToDP(2),
//         }}>
//         <View
//           style={{
//             width: heightPercentageToDP(15),
//             height: heightPercentageToDP(30),
//             backgroundColor: COLORS.lightWhite,
//             position: 'absolute',
//             zIndex: 1,
//             borderTopLeftRadius: heightPercentageToDP(5),
//             borderBottomLeftRadius: heightPercentageToDP(5),
//           }}></View>
//       </View>
//       <View
//         style={{
//           backgroundColor: COLORS.grayHalfBg,
//           width: widthPercentageToDP(50),
//           flex: 1,
//           opacity: 80,
//           elevation: heightPercentageToDP(2),
//         }}>
//         <View
//           className="rounded-full h-5 w-5"
//           style={{
//             margin: heightPercentageToDP(3),
//             backgroundColor: COLORS.background,
//           }}></View>
//       </View>

//       <View
//         style={{
//           flex: 1,
//           backgroundColor: COLORS.grayHalfBg,
//           position: 'absolute',
//           top: '35%',
//           left: '30%',
//           padding: heightPercentageToDP(2),
//           height: heightPercentageToDP(20),
//           width: heightPercentageToDP(20),
//         }}
//         className="rounded-full ">
//         <View
//           style={{
//             height: heightPercentageToDP(15),
//             width: heightPercentageToDP(15),
//             backgroundColor: COLORS.white_s,
//             padding: heightPercentageToDP(2),
//             justifyContent: 'center',
//             alignItems: 'center',
//             overflow: 'hidden',
//           }}
//           className="rounded-full ">
//           <Image
//             source={require('../../assets/image/sincelogo.png')}
//             resizeMode="contain"
//             style={{
//               height: heightPercentageToDP(15),
//               width: heightPercentageToDP(15),
//             }}
//           />
//         </View>
//       </View>

//       <View
//         style={{
//           backgroundColor: 'transparent',
//           position: 'absolute',
//           transform: [{rotate: '90deg'}],
//           bottom: heightPercentageToDP(18),
//           left: heightPercentageToDP(-14),
//           zIndex: 2,
//         }}>
//         <SplashScreenGradientText
//           style={{
//             fontFamily: FONT.Montserrat_SemiBold,
//             fontSize: heightPercentageToDP(6),
//             marginStart: heightPercentageToDP(1),
//             color: COLORS.golden,
//           }}>
//           SINCE 1927
//         </SplashScreenGradientText>
//       </View>

//       <View
//         style={{
//           backgroundColor: 'transparent',
//           transform: [{rotate: '90deg'}],
//           position: 'absolute',
//           zIndex: 2,
//           top: heightPercentageToDP(42),
//           right: widthPercentageToDP(-16),
//         }}>
//         <Text
//           style={{
//             fontFamily: FONT.ELEPHANT,
//             fontSize: heightPercentageToDP(2.6),
//             color: COLORS.golden,
//           }}>
//           THE LION WORLD
//         </Text>
//       </View>
//     </View>
//   );
// };

// export default SplashScreen;

// const styles = StyleSheet.create({});
