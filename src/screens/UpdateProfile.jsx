import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../assets/constants';
import GradientText from '../components/helpercComponent/GradientText';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import ProfileBackground from '../components/background/ProfileBackground';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Wallet from '../components/home/Wallet';
import {Consumer} from 'react-native-paper/lib/typescript/core/settings';
import {useDispatch, useSelector} from 'react-redux';
import {loadProfile, logout} from '../redux/actions/userAction';
import {useMessageAndErrorUser} from '../utils/hooks';
import Loading from '../components/helpercComponent/Loading';
import LinearGradient from 'react-native-linear-gradient';
import UrlHelper from '../helper/UrlHelper';
import axios from 'axios';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';

const UpdateProfile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  // const [email, setEmail] = useState('');

  const {user, accesstoken, loading} = useSelector(state => state.user);

  useMessageAndErrorUser(navigation, dispatch, 'Login');

  const isFocused = useIsFocused();

  useEffect(() => {
    dispatch(loadProfile(accesstoken));
  }, [isFocused]);

  const [showProgressBar, setProgressBar] = useState(false);

  const checkEmailOrPhone = str => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(str);
  };

  const updateProfileHandler = async () => {
    if (!name) {
      Toast.show({
        type: 'error',
        text1: 'Please enter your name',
      });
    } else {
      setProgressBar(true);

      try {
        const {data} = await axios.put(
          UrlHelper.UPDATE_USER_PROFILE_API,
          {
            name: name,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accesstoken}`,
            },
          },
        );

        console.log('datat :: ' + data);

        dispatch(loadProfile(accesstoken));

        Toast.show({
          type: 'success',
          text1: data.message,
        });
        setProgressBar(false);
        navigation.goBack();
      } catch (error) {
        setProgressBar(false);
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
        });
        console.log(error);
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ProfileBackground />

      {/** Profile Cointainer */}

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../assets/image/tlwbg.jpg')}
          style={{
            width: '100%',
            height: heightPercentageToDP(52),
          }}
          imageStyle={{
            borderTopLeftRadius: heightPercentageToDP(5),
            borderTopRightRadius: heightPercentageToDP(5),
          }}>
          <View
            style={{
              height: heightPercentageToDP(52),
              width: widthPercentageToDP(100),

              borderTopLeftRadius: heightPercentageToDP(5),
              borderTopRightRadius: heightPercentageToDP(5),
              elevation: heightPercentageToDP(3),
            }}>
            {/** Top Style View */}
            <View
              style={{
                height: heightPercentageToDP(5),
                width: widthPercentageToDP(100),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: widthPercentageToDP(20),
                  height: heightPercentageToDP(0.8),
                  backgroundColor: COLORS.grayBg,
                  borderRadius: heightPercentageToDP(2),
                }}></View>
            </View>

            <GradientTextWhite
              style={{
                fontSize: heightPercentageToDP(3.5),
                fontFamily: FONT.Montserrat_Bold,
                color: COLORS.darkGray,
                marginStart: heightPercentageToDP(2),
              }}>
              Update
            </GradientTextWhite>

            <GradientTextWhite
              style={{
                fontSize: heightPercentageToDP(3.5),
                fontFamily: FONT.Montserrat_Bold,
                color: COLORS.darkGray,
                marginStart: heightPercentageToDP(2),
              }}>
              Profile
            </GradientTextWhite>

            <ScrollView>
              {/** Profile Main Container */}
              <View
                style={{
                  flex: 2,
                  margin: heightPercentageToDP(2),
                }}>
                <View
                  style={{
                    paddingVertical: heightPercentageToDP(2),
                  }}>
                  {/** Update Profile container */}

                  <TouchableOpacity
                    onPress={() => navigation.navigate('UploadProfilePicture')}
                    style={{
                      height: heightPercentageToDP(7),
                      flexDirection: 'row',
                      backgroundColor: COLORS.white_s,
                      alignItems: 'center',
                      paddingHorizontal: heightPercentageToDP(2),
                      marginTop: heightPercentageToDP(-2),
                      borderRadius: heightPercentageToDP(1),
                    }}>
                    <LinearGradient
                      colors={[COLORS.grayBg, COLORS.white_s]}
                      className="rounded-xl p-1">
                      <MaterialCommunityIcons
                        name={'account'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.darkGray}
                      />
                    </LinearGradient>
                    <Text
                      style={{
                        marginStart: heightPercentageToDP(1),
                        flex: 1,
                        fontFamily: FONT.Montserrat_Regular,
                        fontSize: heightPercentageToDP(2),
                        color: COLORS.black,
                      }}>
                      Profile Picture
                    </Text>

                    <Ionicons
                      name={'chevron-forward-outline'}
                      size={heightPercentageToDP(3)}
                      color={COLORS.darkGray}
                    />
                  </TouchableOpacity>

                  {checkEmailOrPhone(user.email) ? (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ChangeEmail', {forData: 'Email'})
                      }
                      style={{
                        height: heightPercentageToDP(7),
                        flexDirection: 'row',
                        backgroundColor: COLORS.white_s,
                        alignItems: 'center',
                        paddingHorizontal: heightPercentageToDP(2),
                        marginTop: heightPercentageToDP(2),
                        borderRadius: heightPercentageToDP(1),
                      }}>
                      <LinearGradient
                        colors={[COLORS.grayBg, COLORS.white_s]}
                        className="rounded-xl p-1">
                        <Fontisto
                          name={'email'}
                          size={heightPercentageToDP(3)}
                          color={COLORS.darkGray}
                        />
                      </LinearGradient>
                      <Text
                        style={{
                          marginStart: heightPercentageToDP(1),
                          flex: 1,
                          fontFamily: FONT.Montserrat_Regular,
                          fontSize: heightPercentageToDP(2),
                          color: COLORS.black,
                        }}>
                        Change Email
                      </Text>

                      <Ionicons
                        name={'chevron-forward-outline'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.darkGray}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ChangeEmail', {
                          forData: 'Phone No.',
                        })
                      }
                      style={{
                        height: heightPercentageToDP(7),
                        flexDirection: 'row',
                        backgroundColor: COLORS.white_s,
                        alignItems: 'center',
                        paddingHorizontal: heightPercentageToDP(2),
                        marginTop: heightPercentageToDP(2),
                        borderRadius: heightPercentageToDP(1),
                      }}>
                      <LinearGradient
                        colors={[COLORS.grayBg, COLORS.white_s]}
                        className="rounded-xl p-1">
                        <FontAwesome
                          name={'phone'}
                          size={heightPercentageToDP(3)}
                          color={COLORS.darkGray}
                        />
                      </LinearGradient>
                      <Text
                        style={{
                          marginStart: heightPercentageToDP(1),
                          flex: 1,
                          fontFamily: FONT.Montserrat_Regular,
                          fontSize: heightPercentageToDP(2),
                          color: COLORS.black,
                        }}>
                        Change Phone Number
                      </Text>

                      <Ionicons
                        name={'chevron-forward-outline'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.darkGray}
                      />
                    </TouchableOpacity>
                  )}

                  {/** For adding contact */}

                  {checkEmailOrPhone(user.email) ? (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('AddContact', {
                          forData: 'Phone No.',
                        })
                      }
                      style={{
                        height: heightPercentageToDP(7),
                        flexDirection: 'row',
                        backgroundColor: COLORS.white_s,
                        alignItems: 'center',
                        paddingHorizontal: heightPercentageToDP(2),
                        marginTop: heightPercentageToDP(2),
                        borderRadius: heightPercentageToDP(1),
                      }}>
                      <LinearGradient
                        colors={[COLORS.grayBg, COLORS.white_s]}
                        className="rounded-xl p-1">
                        <FontAwesome
                          name={'phone'}
                          size={heightPercentageToDP(3)}
                          color={COLORS.darkGray}
                        />
                      </LinearGradient>
                      <Text
                        style={{
                          marginStart: heightPercentageToDP(1),
                          flex: 1,
                          fontFamily: FONT.Montserrat_Regular,
                          fontSize: heightPercentageToDP(2),
                          color: COLORS.black,
                        }}>
                        Add Phone Number
                      </Text>

                      <Ionicons
                        name={'chevron-forward-outline'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.darkGray}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('AddContact', {forData: 'Email'})
                      }
                      style={{
                        height: heightPercentageToDP(7),
                        flexDirection: 'row',
                        backgroundColor: COLORS.white_s,
                        alignItems: 'center',
                        paddingHorizontal: heightPercentageToDP(2),
                        marginTop: heightPercentageToDP(2),
                        borderRadius: heightPercentageToDP(1),
                      }}>
                      <LinearGradient
                        colors={[COLORS.grayBg, COLORS.white_s]}
                        className="rounded-xl p-1">
                        <Fontisto
                          name={'email'}
                          size={heightPercentageToDP(3)}
                          color={COLORS.darkGray}
                        />
                      </LinearGradient>
                      <Text
                        style={{
                          marginStart: heightPercentageToDP(1),
                          flex: 1,
                          fontFamily: FONT.Montserrat_Regular,
                          fontSize: heightPercentageToDP(2),
                          color: COLORS.black,
                        }}>
                        Update Email
                      </Text>

                      <Ionicons
                        name={'chevron-forward-outline'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.darkGray}
                      />
                    </TouchableOpacity>
                  )}

                  {/** Change name container */}

                  <TouchableOpacity
                    onPress={() => navigation.navigate('ChangeName')}
                    style={{
                      height: heightPercentageToDP(7),
                      flexDirection: 'row',
                      backgroundColor: COLORS.white_s,
                      alignItems: 'center',
                      paddingHorizontal: heightPercentageToDP(2),
                      marginTop: heightPercentageToDP(2),
                      borderRadius: heightPercentageToDP(1),
                    }}>
                    <LinearGradient
                      colors={[COLORS.grayBg, COLORS.white_s]}
                      className="rounded-xl p-1">
                      <MaterialCommunityIcons
                        name={'account'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.darkGray}
                      />
                    </LinearGradient>

                    <Text
                      style={{
                        marginStart: heightPercentageToDP(1),
                        flex: 1,
                        fontFamily: FONT.Montserrat_Regular,
                        fontSize: heightPercentageToDP(2),
                        color: COLORS.black,
                      }}>
                      Change Name
                    </Text>

                    <Ionicons
                      name={'chevron-forward-outline'}
                      size={heightPercentageToDP(3)}
                      color={COLORS.darkGray}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
  },
  textStyleEmail: {
    fontSize: heightPercentageToDP(2),
    fontFamily: FONT.Montserrat_Bold,
  },
});

// import {
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Platform
// } from 'react-native';
// import React, {useState} from 'react';

// import {
//   heightPercentageToDP,
//   widthPercentageToDP,
// } from 'react-native-responsive-screen';
// import {COLORS, FONT} from '../../assets/constants';
// import GradientText from '../components/helpercComponent/GradientText';
// import Toast from 'react-native-toast-message';
// import {useNavigation} from '@react-navigation/native';
// import ProfileBackground from '../components/background/ProfileBackground';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import DocumentPicker from 'react-native-document-picker';
// import ImageResizer from '@bam.tech/react-native-image-resizer';
// import {useDispatch, useSelector} from 'react-redux';
// import {loadProfile, updateProfile} from '../redux/actions/userAction';
// import Loading from '../components/helpercComponent/Loading';
// import axios from 'axios';
// import UrlHelper from '../helper/UrlHelper';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// const UpdateProfile = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   const [name, setName] = useState('');

//   const {user, accesstoken, loading, message} = useSelector(
//     state => state.user,
//   );

//   const [showProgressBar,setProgressBar] = useState(false);
//   const updateProfileHandler  = async () => {
//     if (!name) {
//      Toast.show({
//        type: 'error',
//        text1: 'Enter your name',
//      });

//    } else {
//      setProgressBar(true);

//      try {

//        // Resize the image
//       //  try {
//       //    console.log('Started Compressing Image');
//       //    const resizedImage = await ImageResizer.createResizedImage(
//       //      imageSource.uri,
//       //      200, // Adjust the dimensions as needed
//       //      200, // Adjust the dimensions as needed
//       //      'JPEG',
//       //      100, // Image quality (0-100)
//       //      0, // Rotation (0 = no rotation)
//       //      null,
//       //    );

//       //    console.log('Compressed Image :: ' + resizedImage.size);
//       //    setImageSource(resizedImage);

//       //    if (imageSource) {
//       //      formData.append('photo', {
//       //        uri: resizedImage.uri,
//       //        type: 'image/jpeg',
//       //        name: 'profile.jpg',
//       //      });
//       //    }
//       //  } catch (error) {
//       //    Toast.show({
//       //      type: 'error',
//       //      text1: 'Error resizing the image',
//       //      text2: error,
//       //    });
//       //    // console.error('Error resizing the image:', error);
//       //  }

//        const {data} = await axios.put(
//         UrlHelper.UPDATE_USER_PROFILE_API,
//         {
//           name: name,
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${accesstoken}`,
//           },
//         },
//       );

//       console.log("datat :: "+data)

//       dispatch(loadProfile(accesstoken))

//        Toast.show({
//          type: 'success',
//          text1: data.message,
//        });
//        setProgressBar(false);
//        navigation.goBack();
//      } catch (error) {
//       setProgressBar(false);
//        Toast.show({
//          type: 'error',
//          text1: 'Something went wrong',
//        });
//        console.log(error);

//      }
//    }
//  };

// //  const source = require('../../../assets/image/dummy_user.jpeg');
// //  const [imageSource, setImageSource] = useState(require('../../../assets/image/dark_user.png'));
//  const [imageSource, setImageSource] = useState(null);

//  const checkAndRequestPermission = async () => {
//    const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);

//    if (result === RESULTS.DENIED) {
//      if (Platform.OS === 'android' && Platform.Version <= 29) { // Target Android 10 and above
//        const permissionResult = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
//        if (permissionResult !== RESULTS.GRANTED) {
//          console.log('Permission not granted!');
//          Toast.show({
//            type: 'info',
//            text1: 'Permission not granted!'
//          })
//          return;
//        }

//      }
//    }
//    // Call your DocumentPicker.pick() function here
//    selectDoc();
//  };

//  // For Opening PhoneStorage
//  const selectDoc = async () => {
//    try {
//      const doc = await DocumentPicker.pick({
//        type: [DocumentPicker.types.images],
//        allowMultiSelection: true,
//      });
//      // const doc = await DocumentPicker.pickSingle()
//      // const doc = await DocumentPicker.pickMultiple({
//      //   type: [ DocumentPicker.types.images]
//      // })
//      if (doc) {
//        console.log(doc);
//        console.log(doc[0].uri);
//        setImageSource({ uri: doc[0].uri });
//      }

//    } catch (err) {
//      if (DocumentPicker.isCancel(err))
//        console.log('User cancelled the upload', err);
//      else console.log(err);
//    }
//  };

//   return (
//     <View style={{flex: 1}}>
//       <ProfileBackground />

//       {/** Profile Cointainer */}

//       <View
//         style={{
//           backgroundColor: COLORS.white_s,
//           margin: heightPercentageToDP(2),
//           borderRadius: heightPercentageToDP(1),
//           paddingStart: heightPercentageToDP(1),
//         }}>
//         <GradientText
//           style={{
//             fontSize: heightPercentageToDP(3.5),
//             fontFamily: FONT.Montserrat_Bold,
//           }}>
//           Update
//         </GradientText>

//         <GradientText
//           style={{
//             fontSize: heightPercentageToDP(3.5),
//             fontFamily: FONT.Montserrat_Bold,
//           }}>
//           Profile
//         </GradientText>
//       </View>

//       <View
//         style={{
//           height: heightPercentageToDP(40),
//           width: widthPercentageToDP(100),
//           backgroundColor: COLORS.white_s,
//           borderTopLeftRadius: heightPercentageToDP(5),
//           borderTopRightRadius: heightPercentageToDP(5),
//           elevation: heightPercentageToDP(3),
//         }}>
//         {/** Top Style View */}
//         <View
//           style={{
//             height: heightPercentageToDP(5),
//             width: widthPercentageToDP(100),
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <View
//             style={{
//               width: widthPercentageToDP(20),
//               height: heightPercentageToDP(0.8),
//               backgroundColor: COLORS.grayBg,
//               borderRadius: heightPercentageToDP(2),
//             }}></View>
//         </View>

//         {/** Profile Main Container */}
//         <View
//           style={{
//             flex: 2,
//             margin: heightPercentageToDP(2),
//           }}>
//           <View
//             style={{
//               paddingVertical: heightPercentageToDP(2),
//               gap: heightPercentageToDP(2),
//             }}>
//             {/** Change name container */}

//             <View
//               style={{
//                 height: heightPercentageToDP(7),
//                 flexDirection: 'row',
//                 backgroundColor: COLORS.grayBg,
//                 alignItems: 'center',
//                 paddingHorizontal: heightPercentageToDP(2),
//                 borderRadius: heightPercentageToDP(1),
//               }}>
//               <MaterialCommunityIcons
//                 name={'account'}
//                 size={heightPercentageToDP(3)}
//                 color={COLORS.white}
//               />
//               <TextInput
//                 style={{
//                   marginStart: heightPercentageToDP(1),
//                   flex: 1,
//                   fontFamily: FONT.SF_PRO_REGULAR,
//                 }}
//                 placeholder="Name"
//                 label="Name"
//                 value={name}
//                 onChangeText={text => setName(text)}
//               />
//             </View>

//             {/** Update Profile container */}
//             <TouchableOpacity
//               onPress={updateProfileHandler}
//               style={{
//                 height: heightPercentageToDP(7),
//                 flexDirection: 'row',
//                 backgroundColor: COLORS.grayBg,
//                 alignItems: 'center',
//                 paddingHorizontal: heightPercentageToDP(2),
//                 borderRadius: heightPercentageToDP(1),
//               }}>
//               <MaterialCommunityIcons
//                 name={'account'}
//                 size={heightPercentageToDP(3)}
//                 color={COLORS.white}
//               />
//               <Text
//                 style={{
//                   marginStart: heightPercentageToDP(1),
//                   flex: 1,
//                   fontFamily: FONT.SF_PRO_REGULAR,
//                 }}>
//                 Profile Picture
//               </Text>

//               <Ionicons
//                 name={'chevron-forward-outline'}
//                 size={heightPercentageToDP(3)}
//                 color={COLORS.white}
//               />
//             </TouchableOpacity>

//             {/** Bottom Submit Container */}

//             <View
//               style={{
//                 marginBottom: heightPercentageToDP(5),
//                 marginTop: heightPercentageToDP(2),
//               }}>
//               {showProgressBar ? (
//                 <Loading />
//               ) : (
//                 <TouchableOpacity
//                   onPress={updateProfileHandler}
//                   style={{
//                     backgroundColor: COLORS.blue,
//                     padding: heightPercentageToDP(2),
//                     borderRadius: heightPercentageToDP(1),
//                     alignItems: 'center',
//                   }}>
//                   <Text
//                     style={{
//                       color: COLORS.white,
//                       fontFamily: FONT.Montserrat_Regular,
//                     }}>
//                     Submit
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>

//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default UpdateProfile;

// const styles = StyleSheet.create({
//   textStyle: {
//     fontSize: heightPercentageToDP(4),
//     fontFamily: FONT.Montserrat_Bold,
//   },
//   textStyleEmail: {
//     fontSize: heightPercentageToDP(2),
//     fontFamily: FONT.Montserrat_Bold,
//   },
// });
